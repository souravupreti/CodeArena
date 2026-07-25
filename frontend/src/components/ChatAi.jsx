import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosClient from '../utils/axiosClient';
import { Send, Bot, User } from 'lucide-react';

function ChatAi({
    problem,
    code,
    language
})  {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: `Hi! I'm your Gemini AI Coach. Ask me anything about "${problem?.title || 'this problem'}".` }] },
  ]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async (data) => {
    const newUserMessage = { role: 'user', parts: [{ text: data.message }] };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    reset();

    try {
      const response = await axiosClient.post("/ai/chat", {

    mode: "chat",

    messages: updatedMessages,

    title: problem.title,

    description: problem.description,

    testCases: problem.visibleTestCases,

    templates: problem.templates,

    userCode: code,

    language

});
      setMessages((prev) => [...prev, { role: 'model', parts: [{ text: response.data.message }] }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages((prev) => [...prev, { role: 'model', parts: [{ text: 'Could not reach AI assistant. Please try again.' }] }]);
    }
  };

  return (
    <div className="flex h-[75vh] flex-col overflow-hidden rounded-lg border border-[#303030] bg-[#1a1a1a]">
      <div className="flex items-center gap-2 border-b border-[#303030] bg-[#242424] p-3 text-xs font-bold text-white">
        <Bot size={16} className="text-[#ffa116]" />
        <span>AI Tutor - Logic & Intuition</span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-[#0a84ff] text-white' : 'bg-[#3d2a12] text-[#ffa116]'}`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[82%] rounded-lg p-3 leading-relaxed ${msg.role === 'user' ? 'rounded-tr-none bg-[#0a84ff] text-white' : 'rounded-tl-none border border-[#303030] bg-[#242424] text-[#e5e5e5]'}`}>
              {msg.parts[0].text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="border-t border-[#303030] bg-[#242424] p-3">
        <div className="flex items-center gap-2">
          <input
            placeholder="Ask for guidance or a hint..."
            className="lc-field flex-1"
            {...register('message', { required: true, minLength: 2 })}
          />
          <button type="submit" className="lc-btn lc-btn-primary p-2.5" disabled={errors.message}>
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
