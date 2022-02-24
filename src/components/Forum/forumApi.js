import axios from "axios";
import { urlPrefix } from "../../services/apicollection";

export const getForumByEventID = (challengeId) => {
  const URL = `${urlPrefix}v1.0/getAllEventWiseForum?challengerZoneId=${challengeId}`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
    },
  });
};

export const joinForum = (payload) => {
  const URL = `${urlPrefix}v1.0/subscribeInForum`;
  return axios.post(URL, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
    },
  });
};

export const leaveForum = (forumID) => {
  const URL = `${urlPrefix}v1.0/unregisterForum?forumRegistrationId=${forumID}`;
  return axios.put(
    URL,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        timeStamp: "timestamp",
        accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        withCredentials: true,
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers":
          "accept, content-type, x-access-token, x-requested-with",
      },
    }
  );
};

// Messages

export const fetchMessageByForumID = (forumID, forumRegistrationId, limit) => {
  const URL = `${urlPrefix}v1.0/getForumDiscussions?forumId=${forumID}&forumRegistrationId=${forumRegistrationId}&limit=${limit}&offset=0`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
    },
  });
};

export const sendMessage = (text, contentType, forumID, payload) => {
  let URL = `${urlPrefix}v1.0/sendMessage?trnsForumRegistrationId=${forumID}`;
  let header = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    timeStamp: "timestamp",
    accept: "*/*",
    "Access-Control-Allow-Origin": "*",
    withCredentials: true,
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "accept, content-type, x-access-token, x-requested-with",
  };

  if (text) {
    URL += `&content=${text}`;
  }

  if (contentType === "text") {
    URL += `&contentType=${contentType}`;
  }

  if (contentType === "media") {
    header = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
      "Content-type": "multipart/form-data; boundary=???",
    };
  }

  return axios.post(URL, payload, {
    headers: header,
  });
};

export const replyToMessage = (
  text,
  contentType,
  taggedMessageId,
  trnsForumDiscussionId,
  payload
) => {
  let URL = `${urlPrefix}v1.0/tagMessage?taggedMessageId=${taggedMessageId}&trnsForumRegistrationId=${trnsForumDiscussionId}`;
  // content=${text}&contentType=${contentType}&

  let header = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    timeStamp: "timestamp",
    accept: "*/*",
    "Access-Control-Allow-Origin": "*",
    withCredentials: true,
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "accept, content-type, x-access-token, x-requested-with",
  };

  if (text) {
    URL += `&content=${text}`;
  }

  if (contentType === "text") {
    URL += `&contentType=${contentType}`;
  }

  if (contentType === "media") {
    header = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
      "Content-type": "multipart/form-data; boundary=???",
    };
  }

  return axios.post(URL, payload, {
    headers: header,
  });
};

export const reactToMessage = (payload) => {
  const URL = `${urlPrefix}v1.0/messageReaction`;
  return axios.post(URL, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
    },
  });
};

export const removeMessage = (payload) => {
  const URL = `${urlPrefix}v1.0/removeMessage`;
  return axios.post(URL, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      timeStamp: "timestamp",
      accept: "*/*",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers":
        "accept, content-type, x-access-token, x-requested-with",
    },
  });
};
