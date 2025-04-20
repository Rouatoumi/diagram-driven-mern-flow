
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { ImageIcon, X, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CreateListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [duration, setDuration] = useState("7");
  const [images, setImages] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    setImageUploadLoading(true);
    
    // Simulate image upload (in a real app, you'd upload to your server/cloud storage)
    setTimeout(() => {
      // Create a local URL for display - in a real app, this would be the uploaded URL
      const objectUrl = URL.createObjectURL(file);
      setImages([...images, objectUrl]);
      setImageUploadLoading(false);
      toast.success("Image uploaded successfully");
    }, 1500);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real MERN app, you would make an API call to create the auction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Listing created successfully!");
      // Here you would redirect the user to the new listing page
    } catch (error) {
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create New Auction</h1>
          <p className="text-gray-600 mb-8">Fill in the details below to list your item for auction</p>
          
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter a descriptive title for your item"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide details about your item, including features, history, and any flaws"
                    className="min-h-[150px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="collectibles">Collectibles</SelectItem>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="home-garden">Home & Garden</SelectItem>
                        <SelectItem value="art">Art</SelectItem>
                        <SelectItem value="toys-games">Toys & Games</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="sporting-goods">Sporting Goods</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={condition} onValueChange={setCondition} required>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Auction Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startingPrice">Starting Price ($)</Label>
                    <Input 
                      id="startingPrice" 
                      type="number" 
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reservePrice">
                      Reserve Price ($) <span className="text-gray-500 text-xs">(Optional)</span>
                    </Label>
                    <Input 
                      id="reservePrice" 
                      type="number" 
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">Minimum price for the item to sell. If not met, you're not obligated to sell.</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration} required>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="10">10 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Upload clear photos of your item. First image will be used as the main photo.</p>
                  <p className="text-xs text-gray-500">Maximum 8 images, each under 5MB. Supported formats: JPG, PNG.</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {images.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border bg-gray-50">
                      <img src={src} alt={`Item preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                        onClick={() => removeImage(index)}
                      >
                        <X size={14} />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-pink-500 text-white text-xs text-center py-1">
                          Main Image
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {images.length < 8 && (
                    <label className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      {imageUploadLoading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mb-2"></div>
                          <span className="text-xs text-gray-500">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Plus size={24} className="text-gray-400 mb-1" />
                          <span className="text-sm text-gray-500">Add Image</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={imageUploadLoading || images.length >= 8}
                      />
                    </label>
                  )}
                </div>
                
                {images.length === 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-8 flex flex-col items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">No images uploaded yet</p>
                    <p className="text-sm text-gray-500 mb-4 text-center">Upload high-quality images to increase your chances of selling</p>
                    <label className="cursor-pointer">
                      <Button type="button" variant="outline" disabled={imageUploadLoading}>
                        Upload Images
                      </Button>
                      <input 
                        type="file" 
                        accept="image/jpeg, image/png" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={imageUploadLoading}
                      />
                    </label>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Separator className="my-8" />
            
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Auction..." : "Create Auction"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateListing;
