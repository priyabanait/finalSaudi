// Update seller guide translations in database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Simple Translation Schema
const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

const Translation = mongoose.model('Translation', translationSchema);

// Updated seller guide translations with proper formatting
const sellerGuideTranslations = {
  // English keys with proper formatting
  "Once You've Chosen Your Keller Williams Agent, And Together Have Prepped Your House For Sale And Set A Price, You're Ready For The Public To See Your Home.\n\nWhat Is A Viewing? +\n\nHow Do I Prepare My House For A Viewing? +\n\nWhat Can I Expect When People View My House? +\n\nSelling Your Home Guide.": 
  "بمجرد اختيار وكيل كيلر ويليامز الخاص بك، وبعد أن قمتما معًا بتجهيز منزلك للبيع وتحديد السعر، تكون مستعدًا للجمهور لرؤية منزلك.\n\nما هي المشاهدة؟ +\n\nكيف أجهز منزلي للمشاهدة؟ +\n\nماذا يمكن أن أتوقع عندما يرى الناس منزلي؟ +\n\nدليل بيع منزلك.",

  "Congratulations! You Received A Message From Your Kw Agent That You Have An Offer On Your Home. Now You Need To Evaluate That Offer And Decide How To Respond\n\nWhat Is An Offer? +\n\nHow Do I Evaluate Each Offer? +\n\nWhat Happens If I Receive Multiple Offers? +": 
  "تهانينا! تلقيت رسالة من وكيلك في KW تفيد بوجود عرض على منزلك. الآن تحتاج إلى تقييم هذا العرض وتحديد كيفية الرد\n\nما هو العرض؟ +\n\nكيف أقيم كل عرض؟ +\n\nماذا يحدث إذا تلقيت عروضًا متعددة؟ +",

  "Most Buyers Request A Home Inspection As A Condition Of Their Offer. While A Home Inspector Will Dig More Deeply Into Your Home Than A Buyer, The Preparation You Made Before Your First Viewing Should Help You Get Ready For The Inspection. Your Keller Williams Agent Can Give You Personalised Advice, Too.\n\nWhat Is A Home Inspection? +\n\nWhat Is Looked At During A Home Inspection? +\n\nWhat's Not Looked At During A Home Inspection? +\n\nHow Should I Prepare For An Inspection? +\n\nWhat Happens Now? +": 
  "يطلب معظم المشترين فحصًا منزليًا كشرط لعرضهم. بينما سيقوم مفتش المنزل بالتعمق أكثر في منزلك من المشتري، فإن التحضير الذي قمت به قبل المشاهدة الأولى يجب أن يساعدك على الاستعداد للفحص. يمكن لوكيل كيلر ويليامز الخاص بك أن يقدم لك نصيحة شخصية أيضًا.\n\nما هو فحص المنزل؟ +\n\nماذا يتم النظر فيه أثناء فحص المنزل؟ +\n\nما الذي لا يتم النظر فيه أثناء فحص المنزل؟ +\n\nكيف يجب أن أستعد للفحص؟ +\n\nماذا يحدث الآن؟ +",

  "While It's Tempting To Focus On Your Next Move, Your Keller Williams Agent Is Likely To Remind You That Until The Completion Is Over, You Have Some Final Responsibilities As A Seller.\n\nWhat Should I Do Before The Completion? +\n\nWhat Can I Expect When We Complete? +\n\nWhat's Next? +": 
  "بينما قد يكون المغري التركيز على خطوتك التالية، فمن المرجح أن يذكرك وكيل كيلر ويليامز الخاص بك أنه حتى اكتمال عملية البيع، لديك بعض المسؤوليات النهائية كبائع.\n\nماذا يجب أن أفعل قبل الإتمام؟ +\n\nماذا يمكن أن أتوقع عند الإتمام؟ +\n\nماذا بعد ذلك؟ +",
  
  // Titles
  "Manageviewings": "إدارة المشاهدات",
  "Review Offers": "مراجعة العروض", 
  "Prepare For Inspection": "التحضير للفحص",
  "Completion": "إتمام"
};

async function updateSellerGuideTranslations() {
  try {
    console.log('🌱 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Updating seller guide translations...');
    
    let updated = 0;
    for (const [key, value] of Object.entries(sellerGuideTranslations)) {
      const result = await Translation.findOneAndUpdate(
        { key: key },
        { key: key, value: value },
        { upsert: true, new: true }
      );
      
      if (result) {
        console.log(`✅ Updated: ${key.substring(0, 50)}...`);
        updated++;
      }
    }

    console.log('🎉 Seller guide translations updated successfully!');
    console.log(`📊 Total translations updated: ${updated}`);
    
  } catch (error) {
    console.error('❌ Error updating translations:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

updateSellerGuideTranslations();