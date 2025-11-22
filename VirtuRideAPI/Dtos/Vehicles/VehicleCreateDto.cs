namespace VirtuRideAPI.Dtos.Vehicles
{
    public class VehicleCreateDto
    {
        public int? BranchId { get; set; }
        public string Brand { get; set; } = null!;
        public string Model { get; set; } = null!;
        public int Year { get; set; }
        public int Mileage { get; set; }
        public decimal Price { get; set; }
        public string FuelType { get; set; } = null!;
        public string? Transmission { get; set; }
        public string? Color { get; set; }
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public string? ImageUrls { get; set; }
    }
}
