import 'dotenv/config'; // Add this line at the top of your file
import { auth, signInWithEmailAndPassword } from './firebase-init.js';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

let maps = [];
let currentMapIndex = 0;

// Login functionality
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const adminDoc = await db.collection('admins').doc(user.uid).get();
      if (adminDoc.exists) {
          window.location.href = 'admin.html'; // Redirect to admin page
      } else {
          window.location.href = 'user.html'; // Redirect to user page
      }
  } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed: ' + error.message);
  }
});

// Sign-up functionality
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Store user info in Firestore
      await db.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
      });

      alert('Account created successfully!');
      window.location.href = 'user.html'; // Redirect to user page
  } catch (error) {
      console.error('Error signing up:', error);
      alert('Sign up failed: ' + error.message);
  }
});

// Add admin functionality
async function addAdmin(email, password) {
  try {
    await setDoc(doc(db, "admins", email), { email, password });
    console.log("Admin added successfully!");
  } catch (error) {
    console.error("Error adding admin: ", error);
  }
}

// Fetch maps
async function fetchMaps() {
  const mapsCollection = collection(db, 'maps');
  const mapsSnapshot = await getDocs(mapsCollection);
  maps = mapsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  displayMap();
}

// Display map
function displayMap() {
  if (maps.length > 0) {
    const map = maps[currentMapIndex];
    document.getElementById('map-image').src = map.url;
    document.getElementById('map-description').innerText = map.description;
  } else {
    document.getElementById('map-image').src = '';
    document.getElementById('map-description').innerText = 'No maps available';
  }
}

// Navigation buttons
document.getElementById('prev-map').addEventListener('click', () => {
  if (currentMapIndex > 0) {
    currentMapIndex--;
    displayMap();
  }
});

document.getElementById('next-map').addEventListener('click', () => {
  if (currentMapIndex < maps.length - 1) {
    currentMapIndex++;
    displayMap();
  }
});

// Add map functionality
document.getElementById('add-map-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mapName = document.getElementById('map-name').value;
  const mapDescription = document.getElementById('map-description').value;
  const file = document.getElementById('map-file').files[0];

  try {
    const storageRef = ref(storage, `maps/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, 'maps'), {
      name: mapName,
      description: mapDescription,
      url: fileUrl,
      createdAt: new Date()
    });

    alert('Map added successfully.');
    fetchMaps();
  } catch (error) {
    console.error('Error adding map:', error);
    alert('Failed to add map. Please try again.');
  }
});

// Add legend functionality
document.getElementById('legend-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const label = document.getElementById('legend-label').value;
  const color = document.getElementById('legend-color').value;

  try {
    const mapId = maps[currentMapIndex].id;
    await addDoc(collection(db, 'legends'), { mapId, label, color });
    alert('Legend added successfully.');
  } catch (error) {
    console.error("Error adding legend: ", error);
  }
});

// Delete map functionality
document.getElementById('delete-map').addEventListener('click', async () => {
  try {
    const mapId = maps[currentMapIndex].id;
    await deleteDoc(doc(db, 'maps', mapId));
    fetchMaps();
    alert('Map deleted successfully.');
  } catch (error) {
    console.error("Error deleting map: ", error);
  }
});

// Edit map functionality
document.getElementById('edit-map').addEventListener('submit', async (e) => {
  e.preventDefault();
  const description = document.getElementById('map-desc').value;

  try {
    const mapId = maps[currentMapIndex].id;
    await updateDoc(doc(db, 'maps', mapId), { description });
    fetchMaps();
    alert('Map updated successfully.');
  } catch (error) {
    console.error("Error editing map: ", error);
  }
});

// Download map functionality
document.getElementById('download-map').addEventListener('click', () => {
  const map = maps[currentMapIndex];
  const link = document.createElement('a');
  link.href = map.url;
  link.download = 'map.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error('Error logging out:', error);
  });
});

// Add default map
async function addDefaultMap() {
  const defaultMapImg = "URL_TO_DEFAULT_MAP_IMAGE";
  const defaultDescription = "Default map description";
  try {
    const q = query(collection(db, 'maps'), where("description", "==", defaultDescription));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await addDoc(collection(db, 'maps'), { img: defaultMapImg, description: defaultDescription });
    }
  } catch (error) {
    console.error("Error adding default map: ", error);
  }
}

// Initial setup
addDefaultMap();
fetchMaps();