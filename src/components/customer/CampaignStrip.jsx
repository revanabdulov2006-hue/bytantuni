export default function CampaignStrip({ campaigns }) {
  if (!campaigns || campaigns.length === 0) return null;

  return (
    <div className="-mx-4 snap-x snap-mandatory overflow-x-auto px-4 py-3 scrollbar-none">
      <div className="flex gap-3">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="relative flex h-24 w-52 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl border border-hair p-3 text-white shadow-sm sm:h-28 sm:w-72 sm:p-4"
            style={{
              backgroundImage: camp.bannerImage
                ? `url(${camp.bannerImage})`
                : "linear-gradient(135deg, #F2790A, #FF9A2E)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/25" />
            <span className="relative mb-1 w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">
              -{camp.discountPercent}%
            </span>
            <h3 className="relative font-(--font-display) text-sm font-semibold leading-tight sm:text-base">
              {camp.title}
            </h3>
            <p className="relative mt-0.5 line-clamp-2 text-[11px] text-white/85 sm:text-xs">{camp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
