using Microsoft.EntityFrameworkCore;
using VirtuRideAPI.Models;

namespace VirtuRideAPI.Data
{
    public class VirtuRideContext : DbContext
    {
        public VirtuRideContext(DbContextOptions<VirtuRideContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Branch> Branches => Set<Branch>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<Inquiry> Inquiries => Set<Inquiry>();
        public DbSet<TestDrive> TestDrives => Set<TestDrive>();
        public DbSet<Favorite> Favorites => Set<Favorite>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Favorite composite key
            modelBuilder.Entity<Favorite>()
                .HasKey(f => new { f.UserId, f.VehicleId });

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId);

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Vehicle)
                .WithMany(v => v.Favorites)
                .HasForeignKey(f => f.VehicleId);

            modelBuilder.Entity<TestDrive>()
                .HasOne(td => td.User)
                .WithMany(u => u.TestDrives)
                .HasForeignKey(td => td.UserId);

            modelBuilder.Entity<TestDrive>()
                .HasOne(td => td.Vehicle)
                .WithMany(v => v.TestDrives)
                .HasForeignKey(td => td.VehicleId);

            modelBuilder.Entity<Inquiry>()
                .HasOne(i => i.Vehicle)
                .WithMany(v => v.Inquiries)
                .HasForeignKey(i => i.VehicleId);

            modelBuilder.Entity<Inquiry>()
                .HasOne(i => i.User)
                .WithMany(u => u.Inquiries)
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
