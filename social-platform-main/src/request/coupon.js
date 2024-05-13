import instance from "./index";

export function saveCouponAPI(userId, text, couponNum, couponImg, couponVal) {
  return instance.post(
    "/api/coupon/save",
    {
      userId,
      text,
      couponNum,
      couponImg,
      couponVal,
    },
    {
      withCredentials: true,
    }
  );
}

export function getCouponAPI(userId) {
  return instance.get("/api/coupon", {
    params: {
      userId,
    },
  });
}

export function excCouponAPI(userId, couponId) {
  return instance.post(
    `/api/coupon/exchange?userId=${userId}&couponId=${couponId}`
  );
}
