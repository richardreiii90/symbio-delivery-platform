import { RestaurantCard } from "@/components/restaurant-card"

// Mock data for demonstration
const mockRestaurants = [
  {
    id: "1",
    business_name: "Burger Palace",
    description: "Las mejores hamburguesas de la ciudad",
    address: "Av. Principal 123",
    phone: "+1234567890",
    rating: 4.5,
    delivery_time: "25-35 min",
    delivery_fee: 2.5,
    image_url: "/burger-restaurant.png", // Updated to use generated image
    is_active: true,
  },
  {
    id: "2",
    business_name: "Pizza Express",
    description: "Pizza artesanal con ingredientes frescos",
    address: "Calle Roma 456",
    phone: "+1234567891",
    rating: 4.3,
    delivery_time: "30-40 min",
    delivery_fee: 3.0,
    image_url: "/bustling-pizza-restaurant.png", // Updated to use generated image
    is_active: true,
  },
  {
    id: "3",
    business_name: "Sushi Zen",
    description: "Sushi fresco y auténtico",
    address: "Plaza Central 789",
    phone: "+1234567892",
    rating: 4.7,
    delivery_time: "20-30 min",
    delivery_fee: 4.0,
    image_url: "/bustling-sushi-restaurant.png", // Updated to use generated image
    is_active: true,
  },
  {
    id: "4",
    business_name: "Tacos El Rey",
    description: "Auténticos tacos mexicanos",
    address: "Mercado Norte 321",
    phone: "+1234567893",
    rating: 4.2,
    delivery_time: "15-25 min",
    delivery_fee: 2.0,
    image_url: "/vibrant-mexican-tacos.png", // Updated to use generated image
    is_active: true,
  },
  {
    id: "5",
    business_name: "Café Dulce",
    description: "Postres caseros y café de especialidad",
    address: "Zona Rosa 654",
    phone: "+1234567894",
    rating: 4.6,
    delivery_time: "20-30 min",
    delivery_fee: 2.5,
    image_url: "/cafe-desserts.jpg", // Updated to use generated image
    is_active: true,
  },
  {
    id: "6",
    business_name: "Pasta Italiana",
    description: "Pasta fresca hecha en casa",
    address: "Barrio Italiano 987",
    phone: "+1234567895",
    rating: 4.4,
    delivery_time: "25-35 min",
    delivery_fee: 3.5,
    image_url: "/italian-pasta-restaurant.png", // Updated to use generated image
    is_active: true,
  },
]

export async function RestaurantList() {
  // In a real app, this would fetch from the database based on user location
  // const restaurants = await getBusinessesByLocation(latitude, longitude)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}
