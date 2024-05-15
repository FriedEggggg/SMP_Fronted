import instance from "./index";

export function getProfileData(userId) {
  return instance.get(`/api/user/get-id/${userId}`);
}
// 得到人格标签
export function getProfileData2(roleId) {
    return instance.get(`/api/personality/getrole/${roleId}`);
}
// 得到角色Id
export function getProfileData3(personality) {
    return instance.get(`/api/personality/getpersonality/${personality}`);
}
// 得到人格标签信息
export function getProfileData4(roleId) {
    return instance.get(`/api/personality/getexplaining/${roleId}`);
}

// 得到图片
export function getmbtiPic(roleId) {
    return instance.get(`/api/personality/getmbtipic/${roleId}`);
}

export function updateProfile(formData) {
  return instance.post("/api/user", {
    ...formData,
  });
}
