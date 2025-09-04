import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

const AGE_CHOICES = [
  "0-2 years",
  "3-5 years",
  "6-8 years",
  "9-12 years",
  "13+ years",
];

const AddProductPage: React.FC = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [ageRange, setAgeRange] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [isSale, setIsSale] = useState(false);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !price || !ageRange) {
      return alert("Please fill in Name, Category, Price, and Age Range.");
    }

    const formData = new FormData();
    formData.append("category_id", String(categoryId));
    formData.append("name", name);
    if (slug) formData.append("slug", slug);
    if (description) formData.append("description", description);
    formData.append("price", String(price));
    if (originalPrice) formData.append("original_price", String(originalPrice));
    if (image) formData.append("image", image);
    formData.append("rating", String(rating));
    formData.append("review_count", String(reviewCount));
    formData.append("age_range", ageRange);
    formData.append("is_new", String(isNew));
    formData.append("is_sale", String(isSale));
    if (location) formData.append("location", location);

    setLoading(true);
    try {
      await api.post("/products/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
      navigate("/seller/dashboard");
    } catch (err: any) {
      console.error("Error adding product:", err.response || err);
      alert("Failed to add product. Make sure all required fields are correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Add New Product
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Category */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Category:
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Age Range */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Age Range:
            </label>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Age Range</option>
              {AGE_CHOICES.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Product Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Slug:
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28 resize-none"
            />
          </div>

          {/* Price & Original Price */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Price:
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Original Price:
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Product Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Rating & Review Count */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Rating:
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => {
                let val = parseFloat(e.target.value);
                if (isNaN(val)) val = 0;
                if (val > 5) val = 5;
                if (val < 0) val = 0;
                setRating(val);
              }}
              min={0}
              max={5}
              step={0.1}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Review Count:
            </label>
            <input
              type="number"
              value={reviewCount}
              onChange={(e) => setReviewCount(Number(e.target.value))}
              min={0}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="sm:w-32 text-gray-700 dark:text-gray-300 font-semibold">
              Location:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Flags */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isNew}
                onChange={() => setIsNew(!isNew)}
                className="accent-indigo-600 w-4 h-4"
              />
              Is New
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSale}
                onChange={() => setIsSale(!isSale)}
                className="accent-indigo-600 w-4 h-4"
              />
              On Sale
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
