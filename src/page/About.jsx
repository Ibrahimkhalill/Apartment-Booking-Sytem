const About = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full md:h-[80vh] h-[50vh] relative">
        <img
          src="https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?cs=srgb&dl=pexels-fotoaibe-1571459.jpg&fm=jpg"
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="mask h-full "></div>
        <div className="absolute top-1/2 w-full left-1/2 -translate-x-1/2 -translate-y-1/2 z flex flex-col gap-4 items-center justify-center">
          <h1 className="text-white sm:text-5xl text-3xl font-medium uppercase">
            About Us
          </h1>
          <p className="text-white text-center">
            Welcome to Your Home Away from Home!
          </p>
        </div>
      </div>

      <div className="md:max-w-[60%] my-10 flex flex-col gap-4 px-5 md:px-0">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-medium text-textColor">Who We Are</h1>
          <p className="tracking-normal leading-7">
            At Basunadara Apartment, we pride ourselves on offering exceptional
            hospitality and a unique experience for all our guests. Established
            in 2022, we have been dedicated to providing a warm and welcoming
            atmosphere, ensuring that each guest feels like part of our family.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-medium text-textColor">Our Mission</h1>
          <p className="tracking-normal leading-7">
            Our mission is to deliver unparalleled service and create memorable
            moments for every visitor. Whether you're here for business or
            leisure, our friendly staff is committed to making your stay as
            comfortable and enjoyable as possible.
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-medium text-textColor">
              What We Offer
            </h1>
            <ul className="flex flex-col list-disc pl-5 gap-4">
              <li className="tracking-normal leading-7" >
                <span className="font-medium">Luxurious Accommodations:</span>{" "}
                Our rooms are designed with your comfort in mind, featuring
                modern amenities and elegant decor.
              </li>
              <l className="tracking-normal leading-7">
                <span className="font-medium">Delicious Dining:</span> Enjoy a
                variety of cuisines at our in-house restaurant, where our chefs
                prepare dishes using fresh, local ingredients.
              </l>
              <li className="tracking-normal leading-7" >
                <span className="font-medium">Unmatched Location:</span>{" "}
                Situated in the heart of [City/Area], our hotel offers easy
                access to local attractions, shopping, and entertainment.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-medium text-textColor">Our Values</h1>
            <p>At Basunadara Apartment, we believe in:</p>
            <ul className="flex flex-col list-disc pl-5 gap-4">
              <li className="tracking-normal leading-7">
                <span className="font-medium">Quality:</span> We are dedicated
                to maintaining the highest standards in all aspects of our
                service.
              </li>
              <li className="tracking-normal leading-7">
                <span className="font-medium">Sustainability:</span> We strive
                to minimize our environmental impact and promote eco-friendly
                practices.
              </li>
              <li className="tracking-normal leading-7">
                <span className="font-medium">Community:</span> We actively
                support local businesses and engage in community initiatives.
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-medium text-textColor">Join Us</h1>
            <p className="tracking-normal leading-7">
              We invite you to experience the unique charm and hospitality of
              Apartment. Come stay with us, and let us create
              unforgettable memories for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
