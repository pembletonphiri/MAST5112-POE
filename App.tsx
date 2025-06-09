import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Define the MenuItem type
interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
}

const App = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [currentScreen, setCurrentScreen] = useState('home');
  
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Starters');
  const [price, setPrice] = useState('');
  
  // Filter state
  const [filterCourse, setFilterCourse] = useState('All');

  // Predefined courses that chef can choose from
  const courses = ['Starters', 'Mains', 'Dessert', 'Drinks'];

  // Function to calculate average price per course
  const getAveragePrice = (course: string): number => {
    const courseItems = menuItems.filter(item => item.course === course);
    if (courseItems.length === 0) return 0;
    const total = courseItems.reduce((sum, item) => sum + item.price, 0);
    return total / courseItems.length;
  };

  // Function to handle adding a new menu item
  const handleAddMenuItem = () => {
    if (!dishName || !dishDescription || !price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: dishName,
      description: dishDescription,
      course: selectedCourse,
      price: priceValue
    };
    
    setMenuItems([...menuItems, newMenuItem]);
    
    // Reset form
    setDishName('');
    setDishDescription('');
    setSelectedCourse('Starters');
    setPrice('');
    
    // Go back to home
    setCurrentScreen('home');
  };
  
  // Function to handle deleting a menu item
  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };
  
  // Group menu items by course
  const groupedMenuItems = menuItems.reduce((acc: { [key: string]: MenuItem[] }, item) => {
    if (!acc[item.course]) {
      acc[item.course] = [];
    }
    acc[item.course].push(item);
    return acc;
  }, {});

  // Filter menu items
  const getFilteredItems = () => {
    if (filterCourse === 'All') return groupedMenuItems;
    return { [filterCourse]: groupedMenuItems[filterCourse] || [] };
  };

  // HOME SCREEN
  if (currentScreen === 'home') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.chefName}>BIG CHEF</Text>
        <Image
          source={{ uri: 'https://plus.unsplash.com/premium_photo-1675344317686-118cc9f89f8a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
          style={styles.logo}
          onError={(error) => console.log('Image load error:', error)}
        />

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Menu Statistics</Text>
          <Text style={styles.statsText}>Total Menu Items: {menuItems.length}</Text>
          <View style={styles.averageContainer}>
            {courses.map(course => (
              <Text key={course} style={styles.averageText}>
                {course}: ${getAveragePrice(course).toFixed(2)} avg
              </Text>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setCurrentScreen('add')}
        >
          <Text style={styles.actionButtonText}>Add New Menu Item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setCurrentScreen('filter')}
        >
          <Text style={styles.actionButtonText}>Filter Menu</Text>
        </TouchableOpacity>

        {/* Menu Items Display */}
        <ScrollView style={styles.menuContainer}>
          {Object.keys(groupedMenuItems).length === 0 ? (
            <Text style={styles.noItemsText}>No menu items yet. Add your first item!</Text>
          ) : (
            Object.keys(groupedMenuItems).map((course) => (
              <View key={course} style={styles.courseSection}>
                <Text style={styles.courseTitle}>{course}</Text>
                {groupedMenuItems[course].map((item) => (
                  <View key={item.id} style={styles.menuItem}>
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      <Text style={styles.menuItemDescription}>{item.description}</Text>
                      <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMenuItem(item.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // ADD MENU SCREEN
  if (currentScreen === 'add') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Add New Menu Item</Text>
        </View>

        <ScrollView style={styles.formContainer}>
          <Text style={styles.inputLabel}>Dish Name</Text>
          <TextInput
            style={styles.input}
            value={dishName}
            onChangeText={setDishName}
            placeholder="Enter dish name"
          />
          
          <Text style={styles.inputLabel}>Dish Description</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={dishDescription}
            onChangeText={setDishDescription}
            placeholder="Enter dish description"
            multiline
            numberOfLines={3}
          />
          
          <Text style={styles.inputLabel}>Course</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCourse}
              style={styles.picker}
              onValueChange={(itemValue: string) => setSelectedCourse(itemValue)}
            >
              {courses.map((course) => (
                <Picker.Item key={course} label={course} value={course} />
              ))}
            </Picker>
          </View>
          
          <Text style={styles.inputLabel}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
          />
          
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => setCurrentScreen('home')}
            >
              <Text style={styles.formButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.formButton, styles.saveButton]}
              onPress={handleAddMenuItem}
            >
              <Text style={styles.formButtonText}>Save Item</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // FILTER SCREEN
  if (currentScreen === 'filter') {
    const filteredItems = getFilteredItems();
    
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Filter Menu</Text>
        </View>

        {/* Filter Options */}
        <View style={styles.filterSection}>
          <Text style={styles.inputLabel}>Filter by Course</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filterCourse}
              style={styles.picker}
              onValueChange={(itemValue: string) => setFilterCourse(itemValue)}
            >
              <Picker.Item label="All Courses" value="All" />
              {courses.map((course) => (
                <Picker.Item key={course} label={course} value={course} />
              ))}
            </Picker>
          </View>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setFilterCourse('All')}
          >
            <Text style={styles.actionButtonText}>Show All Items</Text>
          </TouchableOpacity>
        </View>

        {/* Filtered Menu Items */}
        <ScrollView style={styles.menuContainer}>
          {Object.keys(filteredItems).length === 0 ? (
            <Text style={styles.noItemsText}>No menu items found</Text>
          ) : (
            Object.keys(filteredItems).map((course) => (
              <View key={course} style={styles.courseSection}>
                <Text style={styles.courseTitle}>{course}</Text>
                {filteredItems[course] && filteredItems[course].length > 0 ? (
                  filteredItems[course].map((item) => (
                    <View key={item.id} style={styles.menuItem}>
                      <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemDescription}>{item.description}</Text>
                        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMenuItem(item.id)}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noItemsText}>No items in this category</Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  chefName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  logo: {
    width: 400,
    height: 150,
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  statsContainer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  averageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  averageText: {
    fontSize: 14,
    fontWeight: '500',
    width: '48%',
    marginBottom: 5,
  },
  actionButton: {
    backgroundColor: '#90EE90',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuContainer: {
    flex: 1,
  },
  courseSection: {
    marginBottom: 20,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#90EE90',
  },
  formButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  noItemsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default App;