import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';

const Testimonial = () => {

    const testimonials = [
        {
            name: "Emma Rodriguez",
            location: "Barcelona, Spain",
            image: assets.testimonial_image_1,
            testimonial: "I've rented cars from various companies, but the experience with Carrentel was exceptional."
        },
        {
            name: "Emma Rodriguez",
            location: "New York, USA",
            image: assets.testimonial_image_2,
            testimonial: "CarRental made by my trip so much easier. The car was delivered rigth to my door, and the customer service was fantastic!"
        },
        {
            name: "Emma Rodriguez",
            location: "Sydney, Australia",
            image: assets.testimonial_image_1,
            testimonial: "I highly recommend CarRental! Their fleet is amazing, and i always feel like I'm getting the best deal with excellent service."
        },

    ];

    return (
        <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

            <Title title='what our customer say' subtitle='Discover why discerning travelers choose StayVenture for their luxury accommodation around the world.' />


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial,index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow max-w-xs">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <Star key={index} filled={testimonial.rating > index} />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial