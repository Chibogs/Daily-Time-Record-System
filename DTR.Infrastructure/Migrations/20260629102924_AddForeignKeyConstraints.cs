using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DTR.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKeyConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminRemarks",
                table: "attendance_records",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedAt",
                table: "attendance_records",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApprovedByAdminId",
                table: "attendance_records",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentRemarks",
                table: "attendance_records",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_attendance_records_ApprovedByAdminId",
                table: "attendance_records",
                column: "ApprovedByAdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_attendance_records_users_ApprovedByAdminId",
                table: "attendance_records",
                column: "ApprovedByAdminId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_attendance_records_users_StudentId",
                table: "attendance_records",
                column: "StudentId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_attendance_records_users_ApprovedByAdminId",
                table: "attendance_records");

            migrationBuilder.DropForeignKey(
                name: "FK_attendance_records_users_StudentId",
                table: "attendance_records");

            migrationBuilder.DropIndex(
                name: "IX_attendance_records_ApprovedByAdminId",
                table: "attendance_records");

            migrationBuilder.DropColumn(
                name: "AdminRemarks",
                table: "attendance_records");

            migrationBuilder.DropColumn(
                name: "ApprovedAt",
                table: "attendance_records");

            migrationBuilder.DropColumn(
                name: "ApprovedByAdminId",
                table: "attendance_records");

            migrationBuilder.DropColumn(
                name: "StudentRemarks",
                table: "attendance_records");
        }
    }
}
