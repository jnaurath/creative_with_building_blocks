import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export const useFirebase = () => {

    const config = useRuntimeConfig()
    const firebaseConfig = {
        apiKey: config.public.firebase_api_key,
        authDomain: config.public.firebase_auth_domain,
        projectId: config.public.firebase_project_id,
        storageBucket: config.public.firebase_storage_bucket,
        messagingSenderId: config.public.firebase_messaging_sender_id,
        appId: config.public.firebase_app_id,
        measurementId: config.public.firebase_measurement_id
    };

    const firebaseApp = initializeApp(firebaseConfig);
    const firestore = getFirestore(firebaseApp);

    return {
        firebaseApp,
        firestore,
    }
}