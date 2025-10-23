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
        };

        ws.onerror = (error) => {
          console.error("웹소켓 연결 실패:", error);
        };

        ws.onclose = () => {
          console.log("웹소켓 연결 종료");
          wsRef.current = null;
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
    [updateRoomAndMessages, setMessages]
  );

  // 메시지 전송 함수
  const sendMessage = useCallback(
    (content, receiverId) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        console.error("WebSocket이 연결되지 않았습니다.");
        return false;
      }

      try {
        const currentUserId = getCurrentUserId();
        if (!currentUserId) {
          console.error("현재 사용자 ID를 찾을 수 없습니다.");
          return false;
        }

        const message = {
          content: content,
          receiverId: receiverId,
        };

        // 즉시 로컬에 메시지 추가 (낙관적 업데이트)
        const optimisticMessage = {
          messageId: Date.now(), // 임시 ID
          senderId: currentUserId,
          content: content,
          sentAt: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

        // WebSocket으로 메시지 전송
        wsRef.current.send(JSON.stringify(message));
        console.log("메시지 전송 성공:", message);
        return true;
      } catch (error) {
        console.error("메시지 전송 중 오류:", error);
        return false;
      }
    },
    [getCurrentUserId]
  );

  const receiveMessage = useCallback(
    (wsRef.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("받은 메시지:", message);

        setMessages((prevMessages) => {
          // 동일한 내용의 임시 메시지를 실제 메시지로 교체
          const filteredMessages = prevMessages.filter(
            (msg) =>
              msg.content !== message.content ||
              msg.messageId === message.messageId
          );

          return [
            ...filteredMessages,
            {
              messageId: message.messageId,
              senderId: message.sender.userId,
              content: message.content,
              sentAt: message.sentAt,
            },
          ];
        });
      } catch (error) {
        console.error("메시지 파싱 오류:", error);
      }
    })
  );

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
