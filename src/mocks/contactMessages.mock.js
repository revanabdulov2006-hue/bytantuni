function hoursAgo(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

export const CONTACT_MESSAGES_MOCK = [
  {
    id: "msg_1",
    name: "Kamran Vəliyev",
    email: "kamran.v@example.com",
    phone: "+994551112200",
    subject: "Filial açılışı barədə",
    message: "Salam, Sumqayıtda filial açmağı planlaşdırırsınızmı?",
    createdAt: hoursAgo(3),
    read: false,
  },
  {
    id: "msg_2",
    name: "Sevinc Abbasova",
    email: "sevinc.a@example.com",
    phone: "+994703334455",
    subject: "Sifariş gecikməsi",
    message: "Dünənki sifarişim gec çatdırıldı, səbəbini öyrənmək istərdim.",
    createdAt: hoursAgo(20),
    read: false,
  },
  {
    id: "msg_3",
    name: "Orxan Nəsibov",
    email: "orxan.n@example.com",
    phone: "+994557778899",
    subject: "Təşəkkür",
    message: "Xidmətiniz çox gözəl idi, təşəkkürlər!",
    createdAt: hoursAgo(48),
    read: true,
  },
];
