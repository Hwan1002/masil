import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { Api } from "./MasilContext";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  // 채팅방
  const [room, setRoom] = useState(null);
  // 채팅메세지
  const [messages, setMessages] = useState([]);

  // WebSocket 참조
  const wsRef = useRef(null);

  // 로컬스토리지에서 로그인 정보 파싱
  const getCurrentUserId = useCallback(() => {
    try {
      const loginInfo = JSON.parse(localStorage.getItem("login-storage"));
      return loginInfo?.state?.userId;
    } catch (error) {
      console.error("로그인 정보 파싱 오류:", error);
      return null;
    }
  }, []);

  // 채팅방과 메세지 업데이트 함수
  const updateRoomAndMessages = useCallback((newRoom, newMessages) => {
    setRoom(newRoom);
    setMessages(newMessages);
  }, []);

  // WebSocket 연결 해제 함수
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      console.log("WebSocket 연결 해제");
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);
  // WebSocket 연결 함수
  const connectWebSocket = useCallback(
    async (receiverId, accessToken) => {
      try {
        console.log("채팅방 조회 시작 - receiverId:", receiverId);

        // 토큰 확인
        if (!accessToken) {
          console.error("accessToken이 없습니다.");
          throw new Error("인증 토큰이 없습니다.");
        }

        console.log("현재 accessToken:", accessToken);

        const response = await Api.get("/chatting/chatRoom", {
          params: { receiver: receiverId },
        });

        console.log("채팅방 조회 응답:", response.data);
        const { room, messages } = response.data;

        console.log("채팅방 정보:", room);
        console.log("메시지 목록:", messages);

        updateRoomAndMessages(room, messages);

        // 기존 연결이 있으면 닫기
        if (wsRef.current) {
          wsRef.current.close();
        }

        // 새 WebSocket 연결
        const ws = new WebSocket(`ws://localhost:9090/chat`, [
          "chat-v1",
          accessToken,
        ]);

        ws.onopen = () => {
          console.log("웹소켓 연결 성공");
          wsRef.current = ws;

          // 채팅방에 진입 시 세션을 등록하기 위해 join 메시지 전송
          // 백엔드에서 "join" 타입 메시지를 받으면 세션만 등록하고 메시지는 저장하지 않음
          if (room && room.roomId && receiverId) {
            console.log("채팅방 진입 - 세션 등록을 위한 join 메시지 전송");
            const joinMessage = {
              type: "join",
              receiverId: receiverId,
              content: "", // 빈 내용
            };
            try {
              ws.send(JSON.stringify(joinMessage));
              console.log("join 메시지 전송 완료:", joinMessage);
            } catch (error) {
              console.error("join 메시지 전송 실패:", error);
            }
          }
        };

        ws.onerror = (error) => {
          console.error("웹소켓 연결 실패:", error);
          console.error("에러 상세:", {
            error: error,
            readyState: ws.readyState,
          });
        };

        ws.onclose = (event) => {
          console.log("웹소켓 연결 종료", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          });
          wsRef.current = null;

          // 예상치 못한 연결 종료인 경우 재연결 시도하지 않음
          // (사용자가 의도적으로 나간 경우일 수 있으므로)
        };

        // 새로운 메시지 수신 핸들러
        ws.onmessage = (event) => {
          try {
            const rawData = event.data;
            console.log("=== WebSocket 메시지 수신 ===");
            console.log("WebSocket 상태:", ws.readyState);
            console.log("원본 데이터:", rawData);
            console.log("원본 데이터 타입:", typeof rawData);

            const data = JSON.parse(rawData);
            console.log("파싱된 데이터:", data);
            console.log("데이터 구조:", {
              messageId: data.messageId,
              sender: data.sender,
              receiver: data.receiver,
              content: data.content,
              sentAt: data.sentAt,
              isRead: data.isRead,
              type: data.type,
            });

            // 읽지 않은 메시지 수 업데이트 알림인 경우
            if (data.type === "unread_count_update") {
              console.log("읽지 않은 메시지 수 업데이트:", data);
              // Header 컴포넌트에 알림 전송
              const unreadCount = data.unreadCount || 0;
              window.dispatchEvent(
                new CustomEvent("unreadCountUpdate", {
                  detail: { unreadCount },
                })
              );
              return;
            }

            // 일반 메시지인 경우
            // 백엔드에서 ChatMessageDTO로 변환해서 보내므로 senderId와 receiverId가 직접 포함됨
            const senderId = data.senderId;
            const receiverId = data.receiverId;

            console.log("추출된 ID:", { senderId, receiverId });

            // content가 없으면 무시 (join 메시지나 알림 메시지일 수 있음)
            if (!data.content) {
              console.log("content가 없는 메시지 무시:", data);
              return;
            }

            if (!senderId) {
              console.error(
                "senderId를 추출할 수 없습니다. 원본 데이터:",
                data
              );
              console.error(
                "data.sender 전체:",
                JSON.stringify(data.sender, null, 2)
              );
              return;
            }

            // sentAt 파싱 - LocalDateTime은 ISO-8601 형식 또는 배열 형식으로 올 수 있음
            let parsedSentAt;
            if (data.sentAt) {
              if (typeof data.sentAt === "string") {
                parsedSentAt = data.sentAt;
              } else if (Array.isArray(data.sentAt)) {
                // LocalDateTime이 배열 형식 [year, month, day, hour, minute, second, nano]로 올 수 있음
                try {
                  const [year, month, day, hour, minute, second = 0, nano = 0] =
                    data.sentAt;
                  parsedSentAt = new Date(
                    year,
                    month - 1,
                    day,
                    hour,
                    minute,
                    second,
                    Math.floor(nano / 1000000)
                  ).toISOString();
                } catch (e) {
                  console.error("sentAt 배열 파싱 실패:", e);
                  parsedSentAt = new Date().toISOString();
                }
              } else {
                parsedSentAt = new Date().toISOString();
              }
            } else {
              parsedSentAt = new Date().toISOString();
            }

            const newMessage = {
              messageId: data.messageId,
              senderId: senderId,
              receiverId: receiverId,
              content: data.content,
              sentAt: parsedSentAt,
              isRead: data.isRead || false,
            };

            console.log("추가할 메시지:", newMessage);
            console.log("sentAt 원본:", data.sentAt);
            console.log("sentAt 파싱 결과:", parsedSentAt);

            // 현재 사용자 ID 가져오기
            const currentUserId = getCurrentUserId();

            // 메시지 추가 (중복 방지 및 낙관적 메시지 교체)
            setMessages((prevMessages) => {
              // 이미 존재하는 메시지인지 확인 (messageId 기준)
              const existsById = prevMessages.some(
                (msg) => msg.messageId === newMessage.messageId
              );

              if (existsById) {
                console.log(
                  "이미 존재하는 메시지입니다 (messageId):",
                  newMessage.messageId
                );
                return prevMessages;
              }

              // 낙관적 업데이트 메시지가 있는지 확인하고 교체
              // 본인이 보낸 메시지이고 같은 내용의 낙관적 메시지가 있으면 실제 메시지로 교체
              let replaced = false;

              // 낙관적 메시지를 필터링하여 제거하고 실제 메시지로 교체
              const updatedMessages = prevMessages.filter((msg) => {
                // 낙관적 메시지이고 본인이 보낸 메시지인 경우 - 제거
                if (
                  msg.isOptimistic &&
                  msg.senderId === newMessage.senderId &&
                  msg.senderId === currentUserId &&
                  msg.content === newMessage.content
                ) {
                  console.log("낙관적 메시지 제거 (실제 메시지로 교체):", {
                    낙관적: msg.messageId,
                    실제: newMessage.messageId,
                    내용: msg.content,
                  });
                  replaced = true;
                  return false; // 낙관적 메시지 제거
                }
                return true; // 다른 메시지는 유지
              });

              if (replaced) {
                console.log(
                  "낙관적 메시지가 제거되었습니다. 실제 메시지 추가."
                );
                // 실제 메시지 추가
                return [...updatedMessages, newMessage];
              }

              // 본인이 보낸 메시지인데 낙관적 메시지가 없는 경우
              // 이는 본인이 보낸 메시지가 서버에서 다시 돌아온 경우입니다.
              // 낙관적 업데이트가 이미 표시되어 있으므로 중복을 방지하기 위해 무시
              if (newMessage.senderId === currentUserId) {
                console.log(
                  "본인이 보낸 메시지 - 서버 응답 무시 (낙관적 업데이트가 이미 표시됨):",
                  newMessage
                );
                return prevMessages; // 변경 없음
              }

              // 새 메시지 추가
              console.log("새 메시지 추가됨:", newMessage);
              console.log("이전 메시지 수:", prevMessages.length);
              console.log("추가 후 메시지 수:", prevMessages.length + 1);
              return [...updatedMessages, newMessage];
            });
          } catch (error) {
            console.error("메시지 파싱 오류:", error);
            console.error("오류 발생한 데이터:", event.data);
          }
        };

        return ws;
      } catch (error) {
        console.error("채팅방 조회/생성 실패:", error);
        console.error("에러 상세:", error.response?.data);
        console.error("에러 상태:", error.response?.status);

        // 구체적인 에러 메시지 제공
        if (error.response?.status === 401) {
          throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
        } else if (error.response?.status === 404) {
          throw new Error("채팅방을 찾을 수 없습니다.");
        } else if (error.response?.status === 500) {
          throw new Error("서버 오류가 발생했습니다.");
        } else {
          throw new Error("채팅방 조회에 실패했습니다.");
        }
      }
    },
    [updateRoomAndMessages, setMessages, getCurrentUserId]
  );

  // 메시지 전송 함수
  const sendMessage = useCallback(
    (content, receiverId) => {
      console.log("=== sendMessage 호출 ===");
      console.log("wsRef.current:", wsRef.current);
      console.log("readyState:", wsRef.current?.readyState);

      if (!wsRef.current) {
        console.error(
          "WebSocket이 연결되지 않았습니다. wsRef.current가 null입니다."
        );
        return false;
      }

      const readyState = wsRef.current.readyState;
      if (readyState !== WebSocket.OPEN) {
        console.error("WebSocket이 열려있지 않습니다. 상태:", readyState);
        return false;
      }

      try {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) {
          console.error("현재 사용자 ID를 찾을 수 없습니다.");
          return false;
        }

        console.log("=== 메시지 전송 시작 ===");
        console.log("현재 사용자 ID:", currentUserId);
        console.log("수신자 ID:", receiverId);
        console.log("메시지 내용:", content);
        console.log("WebSocket 상태:", wsRef.current.readyState);

        const message = {
          content: content,
          receiverId: receiverId,
        };

        // 임시 메시지 ID 생성 (서버 메시지와 구분하기 위해 음수 사용)
        const tempMessageId = -Date.now();

        // 즉시 로컬에 메시지 추가 (낙관적 업데이트)
        const optimisticMessage = {
          messageId: tempMessageId, // 임시 ID (서버에서 받으면 실제 ID로 교체)
          senderId: currentUserId,
          receiverId: receiverId,
          content: content,
          sentAt: new Date().toISOString(),
          isRead: false,
          isOptimistic: true, // 낙관적 업데이트 표시
        };

        console.log("낙관적 메시지 추가:", optimisticMessage);
        setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

        // WebSocket으로 메시지 전송
        console.log(
          "메시지 전송 직전 WebSocket 상태 재확인:",
          wsRef.current.readyState
        );
        wsRef.current.send(JSON.stringify(message));
        console.log("WebSocket으로 메시지 전송 완료:", message);
        return true;
      } catch (error) {
        console.error("메시지 전송 중 오류:", error);
        console.error("오류 스택:", error.stack);
        return false;
      }
    },
    [getCurrentUserId]
  );

  // receiveMessage 함수는 더 이상 필요하지 않음 (onmessage 핸들러로 대체됨)
  const receiveMessage = useCallback(() => {
    // 이 함수는 이제 사용되지 않지만 호환성을 위해 유지
    console.log("receiveMessage는 onmessage 핸들러로 대체되었습니다.");
  }, []);

  const value = {
    room,
    setRoom,
    messages,
    setMessages,
    updateRoomAndMessages,
    wsRef,
    connectWebSocket,
    sendMessage,
    disconnectWebSocket,
    receiveMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
