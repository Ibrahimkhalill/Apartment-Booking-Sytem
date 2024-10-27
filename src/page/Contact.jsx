const Contact = () => {
  return (
    <div>
      <div className="w-full md:h-[80vh] h-[50vh] relative">
        <img
          src="https://i.pinimg.com/originals/31/6f/c0/316fc08a70b70bec8be281f65624eb65.jpg"
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="mask h-full "></div>
        <div className="absolute top-1/2 w-full left-1/2 -translate-x-1/2 -translate-y-1/2 z flex flex-col gap-4 items-center justify-center">
          <h1 className="text-white sm:text-5xl text-3xl font-medium uppercase">
            Conatct Us
          </h1>
          <p className="text-white text-center">
            For bookings and enquiries, please call us.
          </p>
        </div>
      </div>

      <div className="container m-auto py-10 sm:w-[70%] w-full flex md:flex-row flex-col px-3">
        <div className="sm:w-[40%] w-full flex flex-col gap-3">
          <h1 className="text-xl py-2 font-semibold text-[#795f9e]">Conatct Information</h1>
          <h2 className="sm:text-4xl text-xl">Basundara Apartment, Dhaka</h2>

          <p className=" py-2 md:text-lg">
            Bangabandhu Udyan (Bell’s Park) Band Road, Barisal 8200, Bangladesh.
          </p>
          <div className="flex items-start flex-col gap-3 md:text-lg">
            <span className="font-medium">Phone Number:</span>
            <p>+880171 3056 368 (Hotline),</p>
            <p>+880171 3056 368 (Marketing),</p>
          </div>
          <p className="py-3 md:text-lg ">
           <span className="font-medium">Email: </span> reservation@hotelgrandparkbarisal.com
          </p>
        </div>
        <div className="sm:w-[60%] md:h-auto h-[50vh] w-full border-4 bg-white border-[#baa2db] ">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d912.4601703305208!2d90.4387781695695!3d23.824263725491527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7879873a351%3A0xeaa6e9866d86574c!2sH-Block%207%20No.%20Road%2C%20House%20no%20455!5e0!3m2!1sen!2sbd!4v1726997871799!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 , outline:"none"}}
            allowfullscreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
