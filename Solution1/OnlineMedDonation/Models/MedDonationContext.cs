using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace OnlineMedDonation.Models;

public partial class MedDonationContext : DbContext
{
    public MedDonationContext()
    {
    }

    public MedDonationContext(DbContextOptions<MedDonationContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }
    public virtual DbSet<Donation> Donations { get; set; }
    public virtual DbSet<Hospital> Hospitals { get; set; }
    public virtual DbSet<Medicine> Medicines { get; set; }
    public virtual DbSet<Ngo> Ngos { get; set; }
    public virtual DbSet<Request> Requests { get; set; }
    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=Med_Donation;Integrated Security=True;Encrypt=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__admins__719FE488ED89AEEC");
            entity.ToTable("admins");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Role).HasMaxLength(50);
        });

        modelBuilder.Entity<Donation>(entity =>
        {
            entity.HasKey(e => e.DonationId).HasName("PK__donation__C5082EDB0FE75E48");
            entity.ToTable("donations");

            entity.Property(e => e.DonationId).HasColumnName("DonationID");
            entity.Property(e => e.MedicineId).HasColumnName("MedicineID");
            entity.Property(e => e.DonorId).HasColumnName("DonorID"); // Keep as DonorID
            entity.Property(e => e.MedicineName).HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.ExpiryDate).HasColumnName("ExpiryDate");
            entity.Property(e => e.Quantity).HasColumnName("Quantity");
            entity.Property(e => e.DonorNotes).HasMaxLength(500);
            entity.Property(e => e.AdminNotes).HasMaxLength(500);
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("pending");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ApprovedAt).HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            // Foreign key relationships
            entity.HasOne(d => d.Donor).WithMany(p => p.Donations)
                .HasForeignKey(d => d.DonorId)
                .HasConstraintName("FK__donations__Donor__DonorUser");

            entity.HasOne(d => d.Medicine).WithMany(p => p.Donations)
                .HasForeignKey(d => d.MedicineId)
                .HasConstraintName("FK__donations__Medic__4316F928");
        });

        modelBuilder.Entity<Hospital>(entity =>
        {
            entity.HasKey(e => e.HospitalId).HasName("PK__hospital__38C2E5AF809C32CF");
            entity.ToTable("hospitals");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
        });

        modelBuilder.Entity<Medicine>(entity =>
        {
            entity.HasKey(e => e.MedicineId).HasName("PK__medicine__4F2128F0E23E151D");
            entity.ToTable("medicines");

            entity.Property(e => e.MedicineId).HasColumnName("MedicineID");
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.ExpiryDate).HasColumnName("ExpiryDate");
            entity.Property(e => e.Quantity).HasColumnName("Quantity");
            entity.Property(e => e.DonorId).HasColumnName("DonorID");
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("available");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Donor).WithMany(p => p.Medicines)
                .HasForeignKey(d => d.DonorId)
                .HasConstraintName("FK__medicines__Donor__3F466844");
        });

        modelBuilder.Entity<Ngo>(entity =>
        {
            entity.HasKey(e => e.NgoId).HasName("PK__ngos__94E56EE33C8D7249");
            entity.ToTable("ngos");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.ContactPerson).HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.OrganizationName).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
        });

        modelBuilder.Entity<Request>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__requests__33A8519A55A5D7CA");
            entity.ToTable("requests");

            entity.Property(e => e.RequestId).HasColumnName("RequestID");
            entity.Property(e => e.MedicineName).HasMaxLength(100);
            entity.Property(e => e.RequestDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.RequestedByHospital).WithMany(p => p.Requests)
                .HasForeignKey(d => d.RequestedByHospitalId)
                .HasConstraintName("FK_Requests_Hospital");

            entity.HasOne(d => d.RequestedByNgo).WithMany(p => p.Requests)
                .HasForeignKey(d => d.RequestedByNgoId)
                .HasConstraintName("FK_Requests_Ngo");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__users__1788CC4CD41CF4D1");
            entity.ToTable("users");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);

        // ✅ This conflicting configuration has been removed
        // The DonorId property will now correctly map to DonorID column
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}