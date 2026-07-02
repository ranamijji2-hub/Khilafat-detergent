import Image from "next/image";

export default function LaundryGraphic() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-secondary/15 blur-2xl" />

      <div className="overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl">
        <Image
          src="/images/ceo/ceo.jpg"
          alt="CEO RH & Sons"
          width={500}
          height={650}
          className="h-[520px] w-full object-cover"
          priority
        />
      </div>

      <div className="mt-5 text-center">
        <h3 className="text-2xl font-bold text-primary">
          Mudasir Habib
        </h3>

        <p className="text-sm text-gray-600">
          Chief Executive Officer (CEO)
        </p>
      </div>
    </div>
  );
}