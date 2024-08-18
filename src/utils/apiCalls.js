import axios from "axios";
import uuid from "react-uuid";
import { HttpApiError } from "./HttpRespone";

function endPoint(endPoint) {
  const origin = process.env.API_URL;
  return `${origin}/api/${endPoint}`;
}

// endpoints
export const API = {
  USER: endPoint("user"),

  ADMIN_CHAT_SOCKET: endPoint("chat/"),
  ADMIN_AUTH_LOGIN: endPoint("auth/login"),
};

export async function apiCallAxios(request) {
  console.log(
    `apiCallAxios: ${request.url}, method: ${request.method}, params: ${request.params}`
  );
  const start = Date.now();
  const response = await axios.request(request);
  const timeTaken = Date.now() - start;
  console.log(
    `apiCallAxios: url: ${request.url}. method: ${request.method}. Time taken: ${timeTaken}ms`
  );
  return response;
}

/*
options: {
  id: [optional]
  params: [optional]
  data: [optional]
}.
*/

export async function apiCall(endPoint, method, options, controller) {
  let finalEndpoint = endPoint;
  try {
    const request = {
      method: method,
      url: finalEndpoint,
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        "Content-Type": "application/json",
      },
    };
    console.log(request);
    const res = await apiCallAxios(request);
    if (res.status < 200 || res.status >= 300) {
      if (res.status === 401) {
      }
      throw new Error(`apiCallAxios failed with status: ${res.status}`);
    }
    return res;
  } catch (error) {
    if (error.response?.data?.apiError) {
      if (error.response.data.apiError.status === 401) {
      }
      throw new HttpApiError(
        error.response.data.apiError.status,
        `HttpApiError:${error.response.data.apiError.status} ${finalEndpoint}: (${error.message})`,
        error.response.data.apiError.errorCode
      );
    }
    throw error;
  }
}

export async function uploadBlobCall({
  dstFolder,
  dstFilePrefix,
  srcFile,
  customMetadata,
}) {
  let extension = srcFile.name?.split(".").pop();
  let dstFullName = `${dstFolder}/${dstFilePrefix}:${uuid()}`;
  if (extension) {
    dstFullName = dstFullName + "." + extension;
  }

  let formData = new FormData();
  formData.append("data", srcFile);
  formData.append("name", dstFullName);
  formData.append(
    "metadata",
    JSON.stringify({ ...customMetadata, originalFileName: srcFile.name })
  );
  if (srcFile.type) {
    formData.append("contentType", srcFile.type);
  }

  const apiResponse = await apiCall(API.BLOB, "POST", {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  let blobData = {
    store: apiResponse.data.data.store,
    id: apiResponse.data.data.id,
    mediaLink: apiResponse.data.data.mediaLink,
    size: apiResponse.data.data.size,
    md5Hash: apiResponse.data.data.md5Hash,
    metadata: apiResponse.data.data.metadata,
  };

  let modifiedResponse = {
    file: blobData,
  };

  return modifiedResponse;
}
