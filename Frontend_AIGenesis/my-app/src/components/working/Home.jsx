import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!prompt.trim()) return;
  
    const userMessage = { sender: 'user', text: prompt };
    setMessages(messages => [...messages, userMessage]);
  
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/generate-and-create', { prompt });
      const aiMessage = { sender: 'ai', text: response.data["Duration of Video"] 
        ? `Video Duration: ${response.data["Duration of Video"]} seconds.` 
        : 'Video generation in progress.' 
      };
      setMessages(messages => [...messages, aiMessage]);
    } catch (error) {
      console.error('Error communicating with backend:', error);
      const errorMessage = { sender: 'ai', text: 'Sorry, there was an error processing your request.' };
      setMessages(messages => [...messages, errorMessage]);
    } finally {
      setLoading(false);
    }
  
    setPrompt('');
  };  

  const clearChat = () => {
    setMessages([]);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const processVideo = async () => {
    if (!videoFile) {
      alert("Please upload a video file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", videoFile);
  
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/process-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setVideoUrl(response.data.final_video_path); // Adjust this based on backend response
      console.log("Video processed successfully:", response.data);
    } catch (error) {
      console.error("Error processing video:", error);
      alert("There was an error processing the video.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="flex h-screen w-full text-white font-sans">
      <div className="bg-gray-800 w-52 flex flex-col items-center justify-between p-5 gap-5">
        <div className="flex flex-col gap-5 w-full">
          <button
            onClick={clearChat}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Clear Chat
          </button>
          <label
            htmlFor="upload-video"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center cursor-pointer"
          >
            Upload Video
            <input
              type="file"
              id="upload-video"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={processVideo}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Process Video
          </button>
        </div>
        <Link
          to="/"
          className="w-full flex justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          onClick={() => {
            localStorage.removeItem("token"); // Remove the token from local storage
          }}
        >
          Logout
        </Link>
      </div>
      <div className="flex-1 flex flex-col p-5 bg-gray-900 overflow-y-auto">
        <div className="flex-grow overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[80%] mb-3 p-3 rounded-lg ${message.sender === "user"
                ? "bg-blue-600 text-white float-left clear-both"
                : "bg-gray-100 text-gray-800 float-right clear-both"
                }`}
            >
              <div className="break-words">{message.text}</div>
            </div>
          ))}
          {loading && (
            <div className="text-center p-5 text-gray-400">Loading...</div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex bg-gray-700 p-2 items-center mt-auto">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="flex-grow p-3 text-sm border-2 border-gray-400 rounded-md text-gray-900 mr-3"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </form>
        {videoUrl && (
          <div className="mt-5 p-3 bg-gray-100 rounded-lg text-gray-800">
            <video controls className="w-full rounded-lg">
              <source src={`http://localhost:8000${videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;