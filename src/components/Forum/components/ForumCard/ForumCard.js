import React, { useState } from "react";
import Button from "../../../Common/Form/Button";
import { joinForum } from "../../forumApi";
import CenteredModal from "../../../CenteredModal";

const MONTHS = {
  0: "JAN",
  1: "FEB",
  2: "MAR",
  3: "APR",
  4: "MAY",
  5: "JUN",
  6: "JUL",
  7: "AUG",
  8: "SEP",
  9: "OCT",
  10: "NOV",
  11: "DEC",
};

export const ForumCard = ({
  forum,
  handleForumsFetch,
  showMessage,
  setSelectedForum,
  setLeave,
  setShowMessagePage,
}) => {
  const forumBaner =
    forum?.forumBanner ||
    "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Background.png";
  const forumActiveSinceDate =
    MONTHS[new Date(forum.dateTime).getMonth()] +
    "-" +
    (new Date(forum.dateTime).getFullYear() % 100);
  const [askAlias, setAskAlias] = useState(false);
  const [aliasName, setAliasName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinForum = () => {
    setLoading(true);
    setError("");
    let payload = {
      aliasName: "",
      forumId: forum.forumId,
    };

    if (aliasName) {
      payload.aliasName = aliasName;
    }
    joinForum(payload)
      .then((res) => {
        setLoading(false);
        const { responseCode, responseMessage } = res.data.response;
        if (
          responseCode === 0 &&
          responseMessage === "Subscribe Successfully"
        ) {
          setShowMessagePage();
          handleForumsFetch();
        } else if (responseMessage) {
          setError(responseMessage);
        }
        setAliasName("");
        setAskAlias(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setError("Something went wrong!");
      });
  };

  return (
    <>
      <div className="bg-white h-auto w-[20rem] rounded-lg border border-gray-200">
        <div className="aspect-w-3 aspect-h-2">
          <img
            className="object-cover shadow-sm h-32 w-80 rounded-t-lg"
            src={forumBaner}
            alt=""
          />
        </div>

        <div className="px-2 w-full mt-1">
          <div className="flex gap-4">
            <div className="my-2 text-center w-full">
              <h3 className="font-semibold">{forum.subEventName}</h3>
            </div>
          </div>
          <div className="mb-4">
            <ul role="list" className="flex justify-center space-x-5">
              <li className="border-r pr-5">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">{forum.messages}</p>
                  <p className="text-sm text-gray-500">Messages</p>
                </div>
              </li>
              <li className="border-r pr-5">
                <div className="flex flex-col items-center">
                  <p className="font-semibold">{forum.totalUserCount}</p>
                  <p className="text-sm text-gray-500">Members</p>
                </div>
              </li>
              <li>
                <div className="flex flex-col items-center">
                  <p className="font-semibold">{forumActiveSinceDate}</p>
                  <p className="text-sm text-gray-500">Since</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="mt-2 mb-4">
            {forum?.forumStatus?.toUpperCase() === "INACTIVE" && (
              <Button
                type="default"
                text="Join"
                id="join-forum-button"
                onClick={() => {
                  if (forum.programForumNature.toUpperCase() === "ALIAS") {
                    setAskAlias(true);
                    return;
                  }
                  handleJoinForum(forum.forumId);
                }}
                loading={loading}
              />
            )}
            {forum?.forumStatus?.toUpperCase() === "REJOIN" && (
              <Button
                type="default"
                text="ReJoin"
                id="rejoin-forum-button"
                loading={loading}
                onClick={() => {
                  if (forum.programForumNature.toUpperCase() === "ALIAS") {
                    setAskAlias(true);
                    return;
                  }
                  handleJoinForum(forum.forumId);
                }}
              />
            )}

            {forum?.forumStatus?.toUpperCase() === "ACTIVE" && (
              <div className="flex flex-col md:flex-row w-full md:space-x-2 mb-4">
                <Button
                  type="danger"
                  text="Leave"
                  id="leave-forum-button"
                  loading={loading}
                  onClick={() => {
                    /*handleLeaveForum()*/
                    setSelectedForum(forum);
                    setLeave(true);
                  }}
                />
                <Button
                  type="primary"
                  text="Show Messages"
                  id="show-forum-button"
                  loading={loading}
                  onClick={() => {
                    setSelectedForum(forum);
                    showMessage(forum.forumId, forum.forumRegistrationId);
                  }}
                />
              </div>
            )}
            {error && <h4 className="text-sm text-red-600 p-2">{error}</h4>}
          </div>
        </div>
      </div>
      {askAlias && (
        <CenteredModal
          width={"auto"}
          isOpen
          onRequestClose={() => setAskAlias(false)}
          className="flex flex-col m-4"
        >
          <div className="px-16 py-8 text-center mt-4">
            <p className="text-black text-base">Enter alias name to join</p>
            <div className="flex flex-col items-center space-x-2 mt-4">
              <input
                className="px-4 py-2 border rounded"
                type="text"
                name="alias-name"
                placeholder="Enter alias.."
                onChange={(e) => setAliasName(e.target.value)}
              />
              <button
                className="w-36 border bg-black px-4 py-2 text-white mt-4 rounded-full"
                onClick={() => handleJoinForum()}
              >
                Join
              </button>
            </div>
          </div>
        </CenteredModal>
      )}
    </>
  );
};
