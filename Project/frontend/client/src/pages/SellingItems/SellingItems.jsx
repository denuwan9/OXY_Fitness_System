import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaImage } from 'react-icons/fa';
import './SellingItems.css';

const SellingItems = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const containerRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Sample data for development
  const sampleItems = [
    {
      id: 1,
      name: "Applied Nutrition Whey ",
      category: "Protein",
      price: 25000,
      stock: 8,
      sales: 12,
      image: "src/assets/protein1.png",
      serving: "30g per serving",
      discount: 20
    },
    {
      id: 2,
      name: "BCAA",
      category: "Amino Acids",
      price: 8000,
      stock: 30,
      sales: 80,
      image: "src/assets/pic8.png",
      serving: "10g per serving",
      discount: 15
    },
    {
      id: 3,
      name: "Creatine",
      category: "Performance",
      price: 12500,
      stock: 40,
      sales: 150,
      image: "src/assets/creatine1.png",
      serving: "5g per serving",
      discount: 10
    },
    {
      id: 4,
      name: "Pre-Workout",
      category: "Performance",
      price: 9500,
      stock: 25,
      sales: 21,
      image: "src/assets/pic9.png",
      serving: "15g per serving",
      discount: 25
    },
    {
      id: 5,
      name: "Appied Nutrition",
      category: "Protein",
      price: 32000,
      stock: 3,
      sales: 4,
      image: "src/assets/protein2.png",
      serving: "50g per serving",
      discount: 30
    },
    {
      id: 6,
      name: "Dymatize",
      category: "Protein",
      price: 22000,
      stock: 5,
      sales: 6,
      image: "src/assets/protein3.png",
      serving: "50g per serving",
      discount: 30
    },
    {
      id: 7,
      name: "MuscleTech",
      category: "Protein",
      price: 22000,
      stock: 5,
      sales: 6,
      image: "src/assets/picture7.png",
      serving: "50g per serving",
      discount: 30
    },
    {
      id: 8,
      name: "Creatine",
      category: "Performance",
      price: 12500,
      stock: 40,
      sales: 13,
      image: "src/assets/creatine2.png",
      serving: "5g per serving",
      discount: 10
    },
    {
      id: 9,
      name: "SSA",
      category: "Amino Acids",
      price: 10000,
      stock: 30,
      sales: 80,
      image: "src/assets/pic10.png",
      serving: "10g per serving",
      discount: 15
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(sampleItems);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setShowAddModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setImagePreview(item.image);
    setShowEditModal(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const maxIndex = Math.max(0, filteredItems.length - visibleCards);

  const getTransformValue = () => {
    if (!containerRef.current || !containerRef.current.children[0]) {
      return 'translateX(0)';
    }
    
    const card = containerRef.current.children[0];
    const cardWidth = card.offsetWidth;
    const gap = 20;
    
    const transformValue = -Math.min(
      currentIndex * (cardWidth + gap),
      maxIndex * (cardWidth + gap)
    );
    return `translateX(${transformValue}px)`;
  };

  const goToIndex = (newIndex) => {
    if (newIndex >= 0 && newIndex <= maxIndex) {
      setCurrentIndex(newIndex);
    }
  };

  if (loading) {
    return <div className="items-loading-container">Loading...</div>;
  }

  return (
    <div className="selling-items-container">
      {/* Header Section */}
      <div className="header">
        <div className="header-left">
          <h1>Selling Items</h1>
          <p className="header-subtitle">Manage your product listings</p>
        </div>
        <div className="header-right">
          <div className="search-filter-container">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              <FaFilter className="filter-icon" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="Protein">Protein</option>
                <option value="Amino Acids">Amino Acids</option>
                <option value="Performance">Performance</option>
              </select>
            </div>
          </div>
          <button className="add-item-btn" onClick={handleAddItem}>
            <FaPlus /> Add New Item
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="items-list-container">
        {filteredItems.map(item => (
          <div key={item.id} className="items-product-card">
            <div className="items-card-image-container">
              <img src={item.image} alt={item.name} className="items-card-image" />
            </div>
            <div className="items-card-details">
              <h3 className="items-card-title">{item.name}</h3>
              <p className="items-serving-info">{item.serving}</p>
              
              <div className="items-metrics-grid">
                <div className="items-metric-item">
                  <span className="items-metric-label">Price</span>
                  <span className="items-metric-value">LKR {item.price.toLocaleString()}</span>
                </div>
                <div className="items-metric-item">
                  <span className="items-metric-label">Stock</span>
                  <span className="items-metric-value">{item.stock}</span>
                </div>
                <div className="items-metric-item">
                  <span className="items-metric-label">Sales</span>
                  <span className="items-metric-value">{item.sales}</span>
                </div>
              </div>
              
              <div className="items-action-buttons">
                <button 
                  className="items-edit-button" 
                  onClick={() => handleEditItem(item)}
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className="items-delete-button" 
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="items-modal-overlay">
          <div className="items-modal-content">
            <h2>Add New Item</h2>
            <form className="items-form-container">
              <div className="items-form-group">
                <label>Item Name</label>
                <input type="text" placeholder="Enter item name" className="items-form-input" />
              </div>
              <div className="items-form-group">
                <label>Category</label>
                <select className="items-form-select">
                  <option value="Protein">Protein</option>
                  <option value="Amino Acids">Amino Acids</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
              <div className="items-form-group">
                <label>Price (LKR)</label>
                <input type="number" placeholder="Enter price" className="items-form-input" />
              </div>
              <div className="items-form-group">
                <label>Stock</label>
                <input type="number" placeholder="Enter stock quantity" className="items-form-input" />
              </div>
              <div className="items-form-group">
                <label>Serving Info</label>
                <input type="text" placeholder="Enter serving information" className="items-form-input" />
              </div>
              <div className="items-form-group">
                <label>Discount (%)</label>
                <input type="number" placeholder="Enter discount percentage" className="items-form-input" />
              </div>
              <div className="items-form-group">
                <label>Image</label>
                <label className="items-form-file-label">
                  <FaImage />
                  <span>Click to upload or drag and drop</span>
                  {imagePreview && (
                    <div className="items-form-file-preview show">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                  {selectedImage && (
                    <span className="items-form-file-name">{selectedImage.name}</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="items-form-file"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="items-modal-actions">
                <button type="button" className="items-cancel-button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="items-save-button">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="items-modal-overlay">
          <div className="items-modal-content">
            <h2>Edit Item</h2>
            <form className="items-form-container">
              <div className="items-form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  defaultValue={selectedItem.name} 
                  className="items-form-input" 
                />
              </div>
              <div className="items-form-group">
                <label>Category</label>
                <select defaultValue={selectedItem.category} className="items-form-select">
                  <option value="Protein">Protein</option>
                  <option value="Amino Acids">Amino Acids</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
              <div className="items-form-group">
                <label>Price (LKR)</label>
                <input 
                  type="number" 
                  defaultValue={selectedItem.price} 
                  className="items-form-input" 
                />
              </div>
              <div className="items-form-group">
                <label>Stock</label>
                <input 
                  type="number" 
                  defaultValue={selectedItem.stock} 
                  className="items-form-input" 
                />
              </div>
              <div className="items-form-group">
                <label>Serving Info</label>
                <input 
                  type="text" 
                  defaultValue={selectedItem.serving} 
                  className="items-form-input" 
                />
              </div>
              <div className="items-form-group">
                <label>Discount (%)</label>
                <input 
                  type="number" 
                  defaultValue={selectedItem.discount} 
                  className="items-form-input" 
                />
              </div>
              <div className="items-form-group">
                <label>Image</label>
                <label className="items-form-file-label">
                  <FaImage />
                  <span>Click to upload or drag and drop</span>
                  {imagePreview && (
                    <div className="items-form-file-preview show">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                  {selectedImage && (
                    <span className="items-form-file-name">{selectedImage.name}</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="items-form-file"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="items-modal-actions">
                <button 
                  type="button" 
                  className="items-cancel-button" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="items-save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellingItems;