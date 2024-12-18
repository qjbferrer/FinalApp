import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Camera } from 'expo-camera';
import { ScrollView } from 'react-native';
import { VirtualizedList} from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0Q1mPEBZ-_7pHf4Z64AC5TP7gMMmBHVU",
  authDomain: "mediroverauth.firebaseapp.com",
  projectId: "mediroverauth",
  storageBucket: "mediroverauth.firebasestorage.app",
  messagingSenderId: "159174850894",
  appId: "1:159174850894:web:a1aed433cb92ccbe6f061f",
  measurementId: "G-KSWQWPD2RR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require('./assets/robot.png')} // Correct path to your image
          style={styles.homeImage}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.homeTitle}>MEDIROVER</Text>
        <Text style={styles.homeDescription}>
          Healthcare Assistive Robot
        </Text>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.homeButtonText}>Get started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HealthcareHomepage = ({ route }) => {
  const { userName } = route.params;

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleCameraPress = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setCameraOpen(true);
    } else {
      alert('Camera access denied');
    }
  };

  if (cameraOpen) {
    return (
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}>
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5,
              alignSelf: 'center',
            }}
            onPress={() => setCameraOpen(false)}
          >
            <Text style={{ color: '#000' }}>Close Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    );
  }

  const healthcareInfo = [
    { id: '1', title: 'Temperature', value: '98.6°F', status: 'Normal' },
    { id: '2', title: 'Blood Pressure', value: '120/80 mmHg', status: 'Normal' },
    { id: '3', title: 'Heart Rate', value: '72 bpm', status: 'Normal' },
    { id: '4', title: 'Steps Taken', value: '5000 steps', status: 'Good' },
  ];

  const healthcareTasks = [
    { id: '1', title: 'Capture Temperature', description: 'Measure body temperature using sensors' },
    { id: '2', title: 'Monitor Blood Pressure', description: 'Check patient’s blood pressure levels' },
    { id: '3', title: 'Track Sleep Patterns', description: 'Monitor the quality and duration of sleep' },
    { id: '4', title: 'Gesture, Voice and RC Command', description: 'Multimodal command features for MediRover' },
  ];

  return (
    <VirtualizedList
      data={[1]}  // Just passing a dummy value to enable scrolling
      renderItem={() => (
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}></Text>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>  MediRover Healthcare Robot</Text>
            <Text style={[styles.title, styles.boldText]}>  Dashboard</Text>
          </View>

          {/* Healthcare Info Display */}
          <View style={styles.healthInfoContainer}>
            <Text style={styles.sectionTitle}>Your Health Metrics</Text>
            <View style={styles.healthInfoCards}>
              {healthcareInfo.map(item => (
                <View key={item.id} style={styles.healthInfoCard}>
                  <Text style={styles.healthInfoTitle}>{item.title}</Text>
                  <Text style={styles.healthInfoValue}>{item.value}</Text>
                  <Text
                    style={[
                      styles.healthInfoStatus,
                      item.status === 'Normal' ? styles.normalStatus : styles.warningStatus,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Healthcare Task List */}
          <View style={styles.taskSection}>
            <Text style={styles.sectionTitle}>Healthcare Tasks</Text>
            <FlatList
              data={healthcareTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.taskCard}>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <Text style={styles.taskDescription}>{item.description}</Text>
                  <TouchableOpacity style={styles.startTaskButton}>
                    <Text style={styles.startTaskText}>Start Task</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      getItemCount={() => 1}  // Required for VirtualizedList
      getItem={(data, index) => data[index]}  // Required for VirtualizedList
    />
  );
};

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Registration Successful! Please Sign In.");
        navigation.navigate('SignIn');
      })
      .catch((error) => {
        alert(`Registration failed! Please try again!`);
      });
  };

  return (
    <View style={styles.registerContainer}>
      <Image
        source={require('./assets/medirover.png')} // Replace with the correct image for the circles
        style={styles.circles}
      />
      <Text style={styles.registerTitle}>Hi! I am MediRover!</Text>
      <Text style={styles.registerDescription}>Your personal healthcare assistive robot</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text
          style={styles.signInText}
          onPress={() => navigation.navigate('SignIn')}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
};

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userName = email.split('@')[0];
        alert("Sign In Successful!");
        navigation.navigate('HealthcareHomepage', { userName });
      })
      .catch((error) => {
        alert(`Sign In failed! Please try again!`);
      });
  };

  return (
    <View style={styles.registerContainer}>
      <Image
        source={require('./assets/medirover.png')} // Replace with the correct image for the circles
        style={styles.circles}
      />
      <Text style={styles.registerTitle}>Welcome Back!</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.forgotPassword}>Forgot Password</Text>
      <TouchableOpacity style={styles.registerButton} onPress={handleSignIn}>
        <Text style={styles.registerButtonText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Don’t have an account?{' '}
        <Text
          style={styles.signInText}
          onPress={() => navigation.navigate('Register')}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="HealthcareHomepage" component={HealthcareHomepage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  imageContainer: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBF0',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  homeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  homeTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#444',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 2,
  },
  homeDescription: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  homeButton: {
    backgroundColor: '#4C8BF5',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  workoutContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#4C8BF5',
  },
  searchBar: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  activityCard: {
    backgroundColor: '#F7F9FF',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  activityTime: {
    fontSize: 15,
    color: '#888',
  },
  healthInfoContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  healthInfoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  healthInfoCard: {
    backgroundColor: '#F7F9FF',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  healthInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  healthInfoValue: {
    fontSize: 16,
    color: '#444',
    marginVertical: 5,
  },
  healthInfoStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  normalStatus: {
    color: 'green',
  },
  warningStatus: {
    color: 'red',
  },
  taskSection: {
    marginTop: 30,
    paddingHorizontal: 15,
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  startTaskButton: {
    backgroundColor: '#4C8BF5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  startTaskText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  navIcon: {
    width: 40,
    height: 40,
    tintColor: '#444',
  },
  registerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  circles: {
    width: 120,
    height: 120,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  registerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  registerDescription: {
    fontSize: 16,
    color: '#777',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#4C8BF5',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
  signInText: {
    color: '#4C8BF5',
    fontWeight: '700',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#4C8BF5',
    marginBottom: 20,
    textAlign: 'right',
  },
});