import dad from "../audios/dad.mp3";
import mom from "../audios/mom.mp3";
import save from "../audios/save.mp3";
import send from "../audios/send.mp3";

import { toPng } from "html-to-image";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Addressee from "./Addressee";
import FontButtons from "./FontButtons";
import Letter from "./Letter";
import LetterActions from "./LetterActions";
import MicrophoneControl from "./MicrophoneControl";
import TextToSpeech from "./TextToSpeech";
import ThemeButtons from "./ThemeButtons";
import OthersModal from "./OthersModal";
import getBackendURL from "../utils/getBackendURL";

const LetterContainer = ({ people }) => {
  const [letter, setLetter] = useState("");
  const [font, setFont] = useState("");
  const [parent, setParent] = useState("mom");
  const [audio, setAudio] = useState(null);
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    if (audioRef.current && audio) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }, [audio, font, theme]);

  const letterRef = useRef();

  const saveAsImage = async () => {
    setAudio(save);
    if (letterRef.current) {
      const dataUrl = await toPng(letterRef.current);
      const link = document.createElement("a");
      link.download = "letter.png";
      link.href = dataUrl;
      link.click();
    }
  };

  const sendLetterToWhatsApp = async (letterRef, phone) => {
    try {
      setAudio(send);

      const dataUrl = await toPng(letterRef.current);
      const response = await axios.post(
        getBackendURL() + "/upload",
        { image: dataUrl },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = response.data.imageUrl;

      const phoneNumber = phone;
      const message = encodeURIComponent(
        `Here's a letter from your child: ${imageUrl}`
      );
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error);
    }
  };

  const audioRef = useRef(null);

  const setDadLetter = () => {
    setParent("dad");
    setAudio(dad);
  };
  const setMomLetter = () => {
    setParent("mom");
    setAudio(mom);
  };

  return (
    <>
      {audio && <audio ref={audioRef} src={audio}></audio>}
      <div className="grid grid-cols-3 gap-3 mx-3 md:mx-0 md:gap-0 md:grid md:grid-cols-3 ">
        <ThemeButtons setAudio={setAudio} setTheme={setTheme} />
        <div className=" md:col-span-1 col-span-3 md:order-none flex justify-center w-full flex-col md:py-20">
          <Letter
            parent={parent}
            letterRef={letterRef}
            font={font}
            transcript={letter}
            theme={theme}
          />
          <div className="flex w-full justify-evenly mt-5 md:mt-0">
            <MicrophoneControl setTranscript={setLetter} />
            <TextToSpeech letter={letter} />
          </div>
          <div className="hidden md:block">
            <Addressee
              people={people}
              sendLetterToWhatsApp={sendLetterToWhatsApp}
              letterRef={letterRef}
              setDadLetter={setDadLetter}
              setMomLetter={setMomLetter}
            />
            <div>
              <LetterActions
                letter={letter}
                letterRef={letterRef}
                saveAsImage={saveAsImage}
                sendLetterToWhatsApp={sendLetterToWhatsApp}
                setAudio={setAudio}
                setLetter={setLetter}
              />
            </div>
          </div>
        </div>
        <FontButtons setAudio={setAudio} setFont={setFont} />
        <div className="md:hidden" >
          <Addressee
            people={people}
            sendLetterToWhatsApp={sendLetterToWhatsApp}
            letterRef={letterRef}
            setDadLetter={setDadLetter}
            setMomLetter={setMomLetter}
          />
        </div>
      </div>

      <div className="md:hidden">
        <LetterActions
          letter={letter}
          letterRef={letterRef}
          saveAsImage={saveAsImage}
          sendLetterToWhatsApp={sendLetterToWhatsApp}
          setAudio={setAudio}
          setLetter={setLetter}
        />
      </div>
      <OthersModal
        letterRef={letterRef}
        sendLetter={sendLetterToWhatsApp}
        people={people}
      />
    </>
  );
};

export default LetterContainer;
