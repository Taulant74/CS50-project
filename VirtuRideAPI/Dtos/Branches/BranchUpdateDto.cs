namespace VirtuRideAPI.Dtos.Branches
{
    public class BranchUpdateDto
    {
        public string Name { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? Phone { get; set; }
    }
}
