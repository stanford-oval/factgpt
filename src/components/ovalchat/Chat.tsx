import React, { useState, useEffect } from "react";
import Chatbox from "../interfaces/chatbot/chat/Chatbox";
import DesktopMenu from "../interfaces/chatbot/menu/DesktopMenu";
import { useRouter } from 'next/router';
import getUniqueId from '../../scripts/utils/unique-id';
import shuffleArray from "../../scripts/utils/shuffle-array";
import { allAvailableSystems } from "../global/branding";

export default function Chat({ isHomePage, showSideBar, simplifiedSideBar, showHeader, showSpeechButton, showMicrophone, skipEvaluation, shouldShuffleSystems: shouldShuffleSystems }: any) {

  const router = useRouter();

  const [h, setH] = useState([]);

  const key = router.asPath.match(new RegExp(`[&?]experiment_id=(.*)(&|$)`));



  const [cs, setCs] = useState({
    turn: "user-answer-start",
    audio: {
      player: null,
      messageId: null,
      autoPlaying: false,
      shouldAutoPlay: false,
    },
    responseInfo: {
      responses: [],
      logObjects: [],
      experimentId: null,
      dialogId: null,
      turnId: 0,
      preferredResponseIdx: null,
      randomizedSystemIndices: [...Array(allAvailableSystems().length)].map((item, index) => index), // the order in which we display systems responses to users
    },
    allAvailableSystems: allAvailableSystems(),
    selectedSystem: allAvailableSystems()[0],
    isHomePage: isHomePage,
    messageHistory: [],
    skipEvaluation: skipEvaluation, // whether to skip the evaluation step and jump to comparison
    shouldShuffleSystems: shouldShuffleSystems, // whether to shuffle the systems at each turn
    finishedJob: false // whether the crowdsourcing job has finished
  });

  useEffect(() => {
    var experiment_id: string;
    if (key && key[0]) {
      // extract the experiment_id from the URL
      experiment_id = key[0].replace("?experiment_id=", "")
    } else {
      // default value if not provided in the URL
      experiment_id = "default-experiment"
      if (!isHomePage) {
        router.replace(router.asPath + "?experiment_id=" + experiment_id);
      }

    }

    if (shouldShuffleSystems) {
      // shuffle the systems so that the order users see them is random
      convoState.setValue((cs: any) => ({
        ...cs,
        responseInfo: {
          ...cs.responseInfo,
          randomizedSystemIndices: shuffleArray(cs.responseInfo.randomizedSystemIndices),
        },
      }));
    }



    // set experimentId
    convoState.setValue((cs: any) => ({
      ...cs,
      responseInfo: {
        ...cs.responseInfo,
        experimentId: experiment_id,
      },
    }));

    // set the dialogId if not already set
    convoState.setValue((cs: any) => ({
      ...cs,
      responseInfo: {
        ...cs.responseInfo,
        dialogId: getUniqueId(),
      },
    }));



  }, [router.query]);

  const history = {
    value: h,
    setValue: setH,
  };

  const convoState = {
    value: cs,
    setValue: setCs,
  };

  return (
    <div className="py-4 container flex items-stretch flex-col md:flex-row justify-center md:space-x-2 space-y-2 md:space-y-0">
      <div className={"mx-auto min-h-full" + (showSideBar ? (simplifiedSideBar ? " w-10/12" : " w-3/4") : "basis-3/4 w-5/6")}>
        <Chatbox history={history} convoState={convoState} showHeader={showHeader} showSpeechButton={showSpeechButton} showMicrophone={showMicrophone} />
      </div>
      {showSideBar &&
        <div className={"mx-auto min-h-full" + (simplifiedSideBar ? " w-2/12" : " w-1/4")}>
          <DesktopMenu convoState={convoState} history={history} simplified={simplifiedSideBar} />
          </div>
      }
    </div>
  );
}