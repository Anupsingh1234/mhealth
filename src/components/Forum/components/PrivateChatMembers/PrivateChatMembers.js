import React from "react";
import classNames from "classnames";

const PrivateChatMembers = ({
  privateChatMemberList,
  selectPrivateChatMember,
  selectedMember,
}) => {
  return (
    <div className="bg-[#F4F7FC] border rounded max-w-[16rem] w-[16rem] md:max-w-[22rem] md:w-[22rem] lg:max-w-[64rem] lg:w-[64rem] mx-auto mt-8 px-6 py-4 mb-8 lg:mb-2 flex gap-3 overflow-scroll">
      {Array.isArray(privateChatMemberList) &&
      privateChatMemberList.length > 0 ? (
        <div>
          <p className="mb-2 text-sm">Select a member to chat:</p>
          <div className="flex gap-2">
            {privateChatMemberList.map((member) => (
              <div
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => {
                  selectPrivateChatMember(member.userId);
                }}
              >
                <img
                  className={classNames(
                    "inline-block h-14 w-14 rounded-full hover:ring-2 hover:ring-red-700",
                    {
                      "ring-2 ring-red-700":
                        selectedMember?.userId === member.userId,
                    }
                  )}
                  src={member.avtarImage}
                  alt=""
                />
                <p className="text-xs">{member.aliasName}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mx-auto text-sm"> No Member available to chat</div>
      )}
    </div>
  );
};

export default PrivateChatMembers;
