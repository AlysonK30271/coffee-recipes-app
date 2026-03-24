import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=coffee';

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      const drinks = data.drinks || [];

      const formatted = drinks.map((drink, index) => {
        const ingredients = [];

        for (let i = 1; i <= 15; i++) {
          const ing = drink[`strIngredient${i}`];
          if (ing) ingredients.push(ing);
        }

        return {
          id: drink.idDrink || index,
          title: drink.strDrink,
          image: drink.strDrinkThumb,
          ingredients,
          instructions: drink.strInstructions,
        };
      });

      setRecipes(formatted);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-2xl shadow-md m-3 overflow-hidden">
      <TouchableOpacity onPress={() => setSelected(item)}>
        <Image
          source={{ uri: item.image }}
          className="w-full h-40"
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          {item.title}
        </Text>

        <Text className="text-gray-600 mb-2 font-semibold">
          Ingredients:
        </Text>

        {item.ingredients.map((ing, index) => (
          <Text key={index} className="text-gray-500 text-sm">
            • {ing}
          </Text>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Text className="text-2xl font-bold text-center mt-4">
        ☕ Coffee Recipes
      </Text>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {/* FULL SCREEN MODAL */}
      <Modal visible={!!selected} animationType="slide">
        {selected && (
          <SafeAreaView className="flex-1 bg-white">
            <ScrollView>
              <Image
                source={{ uri: selected.image }}
                className="w-full h-72"
                resizeMode="cover"
              />

              <View className="p-4">
                <Text className="text-2xl font-bold mb-3">
                  {selected.title}
                </Text>

                <Text className="text-lg font-semibold mb-2">
                  Ingredients
                </Text>

                {selected.ingredients.map((ing, index) => (
                  <Text key={index} className="text-gray-600 mb-1">
                    • {ing}
                  </Text>
                ))}

                <Text className="text-lg font-semibold mt-4 mb-2">
                  Instructions
                </Text>

                <Text className="text-gray-700 leading-6">
                  {selected.instructions || 'No instructions available.'}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setSelected(null)}
              className="absolute top-10 right-5 bg-black/70 px-4 py-2 rounded-full"
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}