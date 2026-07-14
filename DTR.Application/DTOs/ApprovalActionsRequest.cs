using System.ComponentModel.DataAnnotations;
namespace DTR.Application.DTOs;

public class ApprovalActionsRequest
{
    [StringLength(500, ErrorMessage = "Remarks cannot exceed 500 characters.")]
    public string? AdminRemarks { get; set; }
}