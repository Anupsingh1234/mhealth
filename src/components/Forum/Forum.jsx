import React, { useEffect, useState } from "react";
import { ForumCard } from "./components/ForumCard";
import Messages from "./components/Messages";
import CircularSpinner from "../../components/CircularSpinner";
import CenteredModal from "../CenteredModal";

import {
  getForumByEventID,
  fetchMessageByForumID,
  leaveForum,
  fetchPrivateChatMember,
  fetchPrivateMemberMessage,
} from "./forumApi";
import { PrimaryButton, SecondaryButton } from "../Form";
import PrivateChatMembers from "./components/PrivateChatMembers";

const Forum = (props) => {
  const { eventID } = props;
  const [showMessagePage, setShowMessagePage] = useState(false);
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedForum, setSelectedForum] = useState();
  const [leave, setLeave] = useState(false);
  const [error, setError] = useState("");
  const [privateChatMember, setPrivateChatMember] = useState([]);
  const [selectedMember, selectPrivateChatMember] = useState(undefined);

  const handleForumFetch = () => {
    setLoading(true);
    getForumByEventID(eventID)
      .then((res) => {
        setLoading(false);
        const {
          responseData: { programForumDetail },
          responseMessage,
        } = res.data.response;
        if (responseMessage === "SUCCESS" && programForumDetail) {
          setForums(programForumDetail);
          return;
        }
        setForums([]);
      })
      .catch((err) => {
        setForums([]);
        setLoading(false);
      });
  };

  const handleFetchMessages = (forumID, forumRegistrationId, limit = 10) => {
    // setLoading(true)
    // setError("")
    fetchMessageByForumID(forumID, forumRegistrationId, limit)
      .then((res) => {
        const { responseCode, responseMessage, responseData } =
          res.data.response;
        if (responseCode === 0 && responseMessage === "SUCCESS") {
          // setMessages(prevMessages => prevMessages.concat(responseData))
          setMessages(responseData);
          setShowMessagePage(true);
        } else {
          setError("Something went wrong!");
        }
        // setLoading(false)
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false)
        setError("Something went wrong!");
      });
  };

  const handleLeaveForum = () => {
    leaveForum(selectedForum.forumId)
      .then((res) => {
        const { responseCode, responseMessage } = res.data.response;
        if (responseCode === 0) {
          setShowMessagePage(false);
          handleForumFetch();
        }
        setLeave(false);
      })
      .catch((err) => {
        console.log(err);
        setLeave(false);
      });
  };

  useEffect(() => {
    if (eventID) {
      setShowMessagePage(false);
      handleForumFetch();
    }
  }, [eventID]);

  useEffect(() => {
    setMessages([]);
  }, [selectedForum]);

  const handleFetchChatMember = (forumId) => {
    fetchPrivateChatMember(forumId).then((res) => {
      if (res.data.response.responseCode === 0) {
        setPrivateChatMember(res.data.response.responseData);
      }
    });
  };

  const handlePrivateChatMessage = (
    forumId,
    forumRegistrationId,
    limit = 10
  ) => {
    if (forumId && forumRegistrationId) {
      fetchPrivateMemberMessage(
        forumId,
        forumRegistrationId,
        selectedMember,
        limit
      )
        .then((res) => {
          const { responseCode, responseMessage, responseData } =
            res.data.response;
          if (responseCode === 0 && responseMessage === "SUCCESS") {
            setMessages(responseData);
            setShowMessagePage(true);
          } else {
            setError("Something went wrong!");
          }
        })
        .catch((err) => {
          setError("Something went wrong!");
        });
    }
  };

  useEffect(() => {
    if (selectedMember) {
      handlePrivateChatMessage(
        selectedForum.forumId,
        selectedForum.forumRegistrationId,
        10
      );
    } else if (selectedForum) {
      handleFetchMessages(
        selectedForum.forumId,
        selectedForum.forumRegistrationId,
        10
      );
    }
  }, [selectedMember]);
  return (
    <div>
      {loading && <CircularSpinner />}
      {!loading && !showMessagePage && (
        <div className="flex flex-col w-full mt-8 border overflow-y-scroll">
          {forums.length === 0 && (
            <div className="rounded-lg p-24 flex items-center justify-center">
              No Forum Available
            </div>
          )}
          {forums.length > 0 && (
            <div className="py-6 max-w-7xl sm:px-6">
              <ul role="list" className="flex space-x-4 items-center">
                {forums.map((forum, index) => (
                  <li key={index}>
                    <ForumCard
                      forum={forum}
                      handleForumsFetch={handleForumFetch}
                      showMessage={handleFetchMessages}
                      setSelectedForum={setSelectedForum}
                      setShowMessagePage={setShowMessagePage}
                      handleFetchChatMember={handleFetchChatMember}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {!loading && showMessagePage && (
        <div>
          {!selectedMember && (
            <Messages
              messages={messages?.messages || []}
              totalMessageCount={messages?.messageCount || 0}
              setMessages={setMessages}
              setShowMessagePage={setShowMessagePage}
              selectedForum={selectedForum}
              setSelectedForum={setSelectedForum}
              handleFetchMessages={handleFetchMessages}
              setLeave={setLeave}
              selectPrivateChatMember={selectPrivateChatMember}
              privateChatMember={privateChatMember}
            />
          )}
          {selectedMember && (
            <Messages
              messages={messages?.messages || []}
              totalMessageCount={messages?.messageCount || 0}
              setMessages={setMessages}
              setShowMessagePage={setShowMessagePage}
              selectedForum={selectedForum}
              setSelectedForum={setSelectedForum}
              handleFetchMessages={handlePrivateChatMessage}
              setLeave={setLeave}
              selectedMember={
                privateChatMember.filter((m) => m.userId === selectedMember)[0]
              }
              selectPrivateChatMember={selectPrivateChatMember}
              privateChatMember={privateChatMember}
            />
          )}
        </div>
      )}
      {leave && (
        <CenteredModal
          width={"auto"}
          isOpen
          onRequestClose={() => setLeave(false)}
          className="flex flex-col m-4"
        >
          <div className="px-16 py-8 text-center mt-4">
            <h2>Do you want to leave the community?</h2>
            <div className="flex space-x-2 mt-4">
              <PrimaryButton mini onClick={() => handleLeaveForum()}>
                Yes
              </PrimaryButton>
              <SecondaryButton mini onClick={() => setLeave(false)}>
                Cancel
              </SecondaryButton>
            </div>
            {error && <p className="text-xs text-red-600 p-2">{error}</p>}
          </div>
        </CenteredModal>
      )}
    </div>
  );
};

export default Forum;
