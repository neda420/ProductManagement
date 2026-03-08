namespace ProductApi.Models;

public class Product
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; } = 0;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}