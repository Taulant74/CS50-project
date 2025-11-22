namespace AutoSalonAPI.Models
{
    public class Car
    {
        public int Id { get; set; }        // Primary key

        public string Brand { get; set; }  // e.g. BMW
        public string Model { get; set; }  // e.g. M3
        public int Year { get; set; }      // e.g. 2018

        public int Mileage { get; set; }   // km
        public decimal Price { get; set; } // €

        public string FuelType { get; set; }    // Petrol, Diesel, Electric
        public string Transmission { get; set; } // Manual, Automatic

        public string Color { get; set; }

        // Short description shown in list
        public string ShortDescription { get; set; }

        // Longer text shown in details
        public string Description { get; set; }

        // Comma-separated image URLs (you can later split on frontend)
        public string ImageUrls { get; set; }
    }
}
