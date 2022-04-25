import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faThumbsUp,
  faTrash,
  faHandsClapping,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { faPaperclip, faReply } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../Common/Form/Button";
import classNames from "classnames";
import { useFilePicker } from "use-file-picker";
import IconCircleButton from "../../../IconCircleButton";
import InfiniteScroll from "react-infinite-scroll-component";
import Avatar from "@material-ui/core/Avatar";
import PrimaryButton from "../../../Form";

import {
  sendMessage,
  removeMessage,
  reactToMessage,
  replyToMessage,
} from "../../forumApi";

const Messages = ({
  messages,
  totalMessageCount,
  setMessages,
  selectedForum,
  setSelectedForum,
  handleFetchMessages,
  setShowMessagePage,
  setLeave,
  selectedMember,
  selectPrivateChatMember,
}) => {
  const [intervalId, setIntervalId] = useState();
  const [replyTo, setReplyTo] = useState();
  const focusTextArea = useRef();
  useEffect(() => {
    if (focusTextArea.current) {
      focusTextArea.current.focus();
      focusTextArea.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [focusTextArea, replyTo]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleFetchMessages(
        selectedForum.forumId,
        selectedForum.forumRegistrationId,
        totalMessageCount
      );
    }, 3000);
    setIntervalId(interval);
    return () => clearInterval(interval);
  }, [selectedMember]);

  useEffect(() => {
    clearInterval(intervalId);
  }, [selectedMember]);

  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState("");
  const [openFileSelector, p] = useFilePicker({
    multiple: true,
    readAs: "DataURL",
    accept: [".jpg", ".png", ".mp4"],
    limitFilesConfig: { min: 1, max: 1 },
  });

  const { filesContent, clear, plainFiles } = p;
  const [file, setFile] = useState();
  const [fileObj, setFileObj] = useState();

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlefetchMoreData = () => {
    if (messages.length + 1 >= selectedForum.messages) {
      setHasMore(false);
      return;
    }

    handleFetchMessages(
      selectedForum.forumId,
      selectedForum.forumRegistrationId,
      totalMessageCount
    );
  };

  const handleMessageSend = (contentType) => {
    let payload = {};
    let content = text;
    if (fileObj) {
      const formData = new FormData();
      formData.append("multipartFile", fileObj);
      payload = formData;
      contentType = "media";
      content = null;
    }
    sendMessage(
      content,
      contentType,
      selectedForum.forumRegistrationId,
      payload,
      selectedMember ? selectedMember.userId : undefined
    )
      .then((res) => {
        const { responseCode } = res.data.response;
        if (responseCode === 0) {
          setMessages([]);
          setText("");
          setFile(undefined);
          setFileObj(undefined);
          handleFetchMessages(
            selectedForum.forumId,
            selectedForum.forumRegistrationId,
            selectedForum.messages + 1
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMessageDelete = (message) => {
    const payload = {
      forumDiscussionId: message.trnsForumDiscussionId,
      forumId: selectedForum.forumId,
      remarks: "",
      userId: localStorage.userId,
    };
    removeMessage(payload)
      .then((res) => {
        const { responseCode } = res.data.response;
        if (responseCode === 0) {
          setMessages([]);
          handleFetchMessages(
            selectedForum.forumId,
            selectedForum.forumRegistrationId,
            messages.length
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMessageApplause = (message) => {
    const payload = {
      name: localStorage.firstName + " " + localStorage.lastName,
      trnsDiscussionId: message.trnsForumDiscussionId,
      trnsRegistrationId: selectedForum.forumRegistrationId,
    };
    reactToMessage(payload)
      .then((res) => {
        const { responseCode } = res.data.response;
        if (responseCode === 0) {
          setMessages([]);
          handleFetchMessages(
            selectedForum.forumId,
            selectedForum.forumRegistrationId,
            messages.length
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMessageReply = (contentType) => {
    let payload = {};
    let content = text;
    if (fileObj) {
      const formData = new FormData();
      formData.append("multipartFile", fileObj);
      payload = formData;
      contentType = "media";
      content = null;
    }
    replyToMessage(
      text,
      contentType,
      replyTo.trnsForumDiscussionId,
      selectedForum.forumRegistrationId,
      payload
    )
      .then((res) => {
        const { responseCode } = res.data.response;
        if (responseCode === 0) {
          setMessages([]);
          setReplyTo(undefined);
          setText("");
          handleFetchMessages(
            selectedForum.forumId,
            selectedForum.forumRegistrationId,
            messages.length + 1
          );
          setFile(undefined);
          setFileObj(undefined);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getReadableDate = (date) => {
    if (!date) {
      return "";
    }
    return date;
  };

  const getTaggedMessageByType = (taggedMessage) => {
    if (taggedMessage?.tagMessageContentType) {
      switch (taggedMessage.tagMessageContentType) {
        case "image/png":
        case "image/jpeg":
          return (
            <div className="flex flex-col bg-gray-50 text-black border border-l-4 border-l-orange-800 rounded mb-2 py-2 opacity-75">
              <p className="flex text-[10px] italic text-black mx-2">
                Replied to:
                <span className="text-[11px] font-semibold text-black mx-1">
                  {taggedMessage.name}
                </span>
              </p>
              <img
                className="m-2"
                src={taggedMessage.tagMessageContent}
                width={125}
              />
            </div>
          );
        case "video/mp4":
          return (
            <div>
              <div className="flex flex-col bg-gray-50 text-black border border-l-4 border-l-orange-800 rounded mb-2 py-2 opacity-75">
                <p className="flex text-[10px] italic text-black mx-2">
                  Replied to:
                  <span className="text-[11px] font-semibold text-black mx-1">
                    {taggedMessage.name}
                  </span>
                </p>
                <video controls width="125" className="m-2">
                  <source
                    src={taggedMessage.tagMessageContent}
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          );
        case "text":
          return (
            <div>
              <div className="flex flex-col bg-gray-50 text-black border border-l-4 border-l-orange-800 rounded mb-2 py-2 opacity-75">
                <p className="text-[10px] italic text-black mx-2">
                  Replied to:
                  <span className="text-[11px] font-semibold text-black mx-1">
                    {taggedMessage.name}
                  </span>
                </p>
                <p className="text-[11px] font-semibold px-2">
                  {taggedMessage.tagMessageContent}
                </p>
              </div>
            </div>
          );
      }
    } else {
      return "";
    }
  };

  const getMessageByType = (message) => {
    switch (message.contentType) {
      case "image/png":
      case "image/jpeg":
        return (
          <div className="flex flex-col">
            {getTaggedMessageByType(message.taggedMessageDetails)}
            <img src={message.content} width={125} />
          </div>
        );
      case "video/mp4":
        return (
          <div className="flex flex-col">
            {getTaggedMessageByType(message.taggedMessageDetails)}
            <video controls width="125">
              <source src={message.content} type="video/mp4" />
            </video>
          </div>
        );
      case "text":
        return (
          <div className="flex flex-col">
            {getTaggedMessageByType(message.taggedMessageDetails)}
            <p className="text-black font-semibold text-sm">
              {message.content}
            </p>
          </div>
        );
    }
  };

  const renderMessageBody = (message, index) => {
    const userMessage = message.alignment === 1;
    const receivedMessage = message.alignment === 0;
    return (
      <li key={message.userName + index}>
        <div
          className={classNames(
            "flex space-x-4",
            "justify-start text-[#6B7C8F]",
            {
              "justify-start flex-row-reverse gap-4": userMessage,
            }
          )}
        >
          <div className="flex flex-col justify-center items-center">
            {programForumNature &&
              ["IDENTITY", "ALIAS"].includes(
                programForumNature.toUpperCase()
              ) && <Avatar alt={message.userName} src={message.userAvatar} />}
            {programForumNature &&
              programForumNature.toUpperCase() === "ANONYMOUS" && <Avatar />}
            <div className="mt-1 text-black">
              {programForumNature &&
                ["IDENTITY"].includes(programForumNature.toUpperCase()) && (
                  <p className="text-xs font-semibold text-black">
                    {message.userName}
                  </p>
                )}
              {programForumNature &&
                ["ALIAS"].includes(programForumNature.toUpperCase()) && (
                  <p className="text-xs font-semibold text-black">
                    {message.userAliasName}
                  </p>
                )}
            </div>
          </div>

          {/* sender action */}
          <div className="flex flex-col gap-1 rtl:mr-2">
            <div className="flex items-center gap-2 w-full">
              {userMessage && (
                <div className="flex space-x-2 items-center">
                  {message?.reactions && message.reactions.applause === null && (
                    <div
                      className={classNames(
                        "flex gap-2 none",
                        "bg-[#F4F7FC] rounded-md px-2 py-1"
                      )}
                    >
                      <FA
                        icon={faTrash}
                        size="xs"
                        onClick={() => handleMessageDelete(message)}
                        className="transition-all duration-200 text-gray-400 hover:text-gray-600 hover:scale-110 cursor-pointer"
                      />
                    </div>
                  )}
                  {message?.reactions &&
                    message.reactions.applause &&
                    message.reactions.applause.applauseDetailsList &&
                    message.reactions.applause.applauseDetailsList.length && (
                      <div
                        className={classNames(
                          "flex gap-2 none",
                          "bg-[#F4F7FC] rounded-md px-2 py-1"
                        )}
                      >
                        <span className="flex items-center space-x-1">
                          <FA
                            icon={faHandsClapping}
                            size="sm"
                            className="transition-all duration-200 text-amber-500 hover:text-orange-500 hover:scale-110 cursor-pointer"
                          />
                          <p className="text-black text-xs">
                            {message?.reactions &&
                              message.reactions.applause &&
                              message.reactions.applause.applauseDetailsList &&
                              message.reactions.applause.applauseDetailsList
                                .length}
                          </p>
                        </span>
                      </div>
                    )}
                </div>
              )}

              {/* message content */}

              <div className="flex flex-col">
                {/* name */}

                <div
                  className={classNames(
                    "font-medium text-lg leading-6 space-y-1 px-4 py-3 rounded-lg",
                    "max-w-md break-all",
                    { "bg-[#F4F7FC]": receivedMessage },
                    { "bg-[#F3F1FF]": userMessage }
                  )}
                >
                  {/* media */}
                  {getMessageByType(message)}
                </div>
                {/* date time */}
                <div className="ml-4 mt-[4px] flex justify-end items-center">
                  <p className="font-semibold text-[9px] italic">
                    {getReadableDate(message.entryDatetime)}
                  </p>
                </div>
              </div>

              {/* receiver action */}
              {receivedMessage && (
                <div className="flex gap-2 bg-[#F4F7FC] rounded-md px-2 py-1">
                  <span className="flex items-center space-x-1">
                    <FA
                      icon={faHandsClapping}
                      size="xs"
                      className={classNames(
                        "transition-all duration-200",
                        "text-gray-200 cursor-pointer",
                        "hover:text-red-500 hover:scale-110",
                        "m-0 p-0"
                      )}
                      onClick={() => handleMessageApplause(message)}
                    />
                    <p className="text-xs">
                      {message?.reactions &&
                        message.reactions.applause &&
                        message.reactions.applause.applauseDetailsList &&
                        message.reactions.applause.applauseDetailsList.length}
                    </p>
                  </span>
                  <FA
                    icon={faReply}
                    size="1x"
                    onClick={() => setReplyTo(message)}
                    className="transition-all duration-200 text-gray-200 hover:text-gray-600 hover:scale-110 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </li>
    );
  };

  const renderMediaFile = (replyTo) => {
    switch (fileObj.type) {
      case "image/png":
      case "image/jpeg":
      case "image/jpg":
        return (
          <div className="border rounder p-2 relative">
            <IconCircleButton
              iconSize={15}
              size={20}
              icon={faTimes}
              className="text-gray-400 bg-gray-100 absolute right-4 top-2"
              onClick={(e) => {
                e.stopPropagation();
                setFile(undefined);
                setFileObj(undefined);
              }}
            />
            <img src={file || ""} width="200px" />
          </div>
        );
      case "video/mp4":
        return (
          <div className="border rounder p-2 relative">
            <IconCircleButton
              iconSize={15}
              size={20}
              icon={faTimes}
              className="text-gray-400 bg-gray-100 absolute right-4 top-2"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
            />
            <video controls width="250">
              <source src={file} type="video/mp4" />
            </video>
          </div>
        );
    }
  };

  const { programForumNature, subEventName } = selectedForum;
  const onFileChange = (event) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        getBase64(files[0]).then((res) => {
          setFile(res);
          setFileObj(files[0]);
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#F4F7FC] border rounded-lg mt-8">
      <div className="flex flex-col bg-white md:m-6 p-8 rounded-md md:max-w-5xl md:w-full md:mx-auto">
        <div className="flex justify-between mb-8 items-center">
          <div className="flex items-center space-x-2">
            <IconCircleButton
              iconSize={15}
              size={20}
              icon={faAngleLeft}
              className="text-white bg-gray-400"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedForum(undefined);
                setShowMessagePage(false);
                setMessages([]);
                selectPrivateChatMember(undefined);
              }}
            />
            {!selectedMember && (
              <p className="font-semibold text-xs md:text-base">{`Messages (${subEventName})`}</p>
            )}
            {selectedMember && (
              <p className="font-semibold text-xs md:text-base">{`Messages (${selectedMember.aliasName})`}</p>
            )}
          </div>
          <div>
            <button
              className={classNames(
                "border-0 rounded-full outline-none focus:outline-none",
                "flex justify-center items-center w-full",
                "cursor-pointer",
                "px-4 py-1",
                "bg-red-600 text-white text-sm"
              )}
              onClick={() => {
                selectedMember
                  ? selectPrivateChatMember(undefined)
                  : setLeave(true);
              }}
            >
              {selectedMember ? "Back to Forum Messages" : "Leave"}
            </button>
          </div>
        </div>
        <div
          id="scrollableDiv"
          style={{
            height: 650,
            overflow: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <InfiniteScroll
            dataLength={messages.length}
            next={handlefetchMoreData}
            hasMore={hasMore}
            // height="650px"
            inverse={true}
            loader={<></>}
            scrollableTarget="scrollableDiv"
            style={{ display: "flex", flexDirection: "column-reverse" }}
          >
            <ul role="list" className="space-y-6">
              {messages
                .sort((a, b) =>
                  a.trnsForumDiscussionId < b.trnsForumDiscussionId ? -1 : 1
                )
                .map((message, index) => renderMessageBody(message, index))}
            </ul>
          </InfiniteScroll>
        </div>

        {/* INPUT */}
        <div className="flex items-center space-x-3 justify-between w-full">
          <div className="space-x-2 flex-0">
            <div className="image-upload">
              <label for="file-input">
                <FA
                  icon={faPaperclip}
                  className="text-gray-500 hover:text-gray-600 cursor-pointer"
                />
              </label>

              <input
                id="file-input"
                type="file"
                onChange={(e) => {
                  onFileChange(e);
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            {replyTo && (
              <div className="border flex relative p-4 rounded mt-4">
                <div>
                  {programForumNature &&
                    ["IDENTITY"].includes(programForumNature.toUpperCase()) && (
                      <p className="text-xs font-semibold text-black">
                        {replyTo.userName}
                      </p>
                    )}
                  {programForumNature &&
                    ["ALIAS"].includes(programForumNature.toUpperCase()) && (
                      <p className="text-xs font-semibold text-black">
                        {replyTo.userAliasName}
                      </p>
                    )}
                  {["image/jpeg", "image/jpg", "image/png"].includes(
                    replyTo.contentType
                  ) && <img src={replyTo.content} width={125} />}
                  {["video/mp4"].includes(replyTo.contentType) && (
                    <video controls width="125">
                      <source src={replyTo.content} type="video/mp4" />
                    </video>
                  )}
                  {replyTo.contentType === "text" && <h3>{replyTo.content}</h3>}
                </div>
                <div>
                  <IconCircleButton
                    iconSize={15}
                    size={20}
                    icon={faTimes}
                    className="text-gray-400 bg-gray-100 absolute right-0 top-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReplyTo(undefined);
                    }}
                  />
                </div>
              </div>
            )}
            <div className="mt-2">
              {file && fileObj ? (
                renderMediaFile(replyTo)
              ) : (
                <textarea
                  ref={focusTextArea}
                  value={text}
                  rows={2}
                  name="forum-message"
                  id="forum-message"
                  className="p-4 resize-none bg-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  defaultValue={""}
                  onChange={(e) => setText(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="flex-0">
            <Button
              id="forum-message-send"
              onClick={() => {
                if (replyTo) {
                  handleMessageReply("text");
                  return;
                }
                handleMessageSend("text");
              }}
              text="Send"
              type="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
