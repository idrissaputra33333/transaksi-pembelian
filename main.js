import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

// ini adalah konfigurasi firebase
const firebaseConfig = {
apiKey: "AIzaSyCRRFaBrm14cIoJ1nW5knt4Afd10H402Lo",
    authDomain: "insan-cemerlang-bbed3.firebaseapp.com",
    projectId: "insan-cemerlang-bbed3",
    storageBucket: "insan-cemerlang-bbed3.appspot.com",
    messagingSenderId: "1014883164148",
    appId: "1:1014883164148:web:f4c238c0022fb007eee3a1",
    measurementId: "G-81DKK8YWJT"
  };

//inisialisasi firebase
const aplikasi = initializeApp(firebaseConfig)
const basisdata = getFirestore(aplikasi)

// fungsi ambil daftar barang
export async function ambilDaftarBarang() {
  const refDokumen = collection(basisdata, "inventory");
  const kueri = query(refDokumen, orderBy("item"));
  const cuplikanKueri = await getDocs(kueri);
  
  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      item: dokumen.data().item,
      jumlah: dokumen.data().jumlah,
      harga: dokumen.data().harga
    })
  })
  
  return hasilKueri;
}

// menambah barang ke keranjang
export async function tambahBarangKeKeranjang(
  idbarang,
  nama,
  harga,
  jumlah,
  idpelanggan,
  namapelanggan
) {
  try {
    // periksa apakah idbarang sudah ada di collection transaksi?
    
    // mengambil data di seluruh collection transaksi
    let refDokumen = collection(basisdata, "transaksi")
    
    // membuat query untuk mencari data berdasarkan idbarang
    let queryBarang = query(refDokumen, where("idbarang", "==", idbarang))
    
    let snapshotBarang = await getDocs(queryBarang)
    let jumlahRecord = 0
    let idtransaksi = ''
    let jumlahSebelumnya = 0
    
    snapshotBarang.forEach((dokumen) => {
      jumlahRecord++
      idtransaksi = dokumen.id
      jumlahSebelumnya = dokumen.data().jumlah
    })
    
    if (jumlahRecord == 0) {
      // kalau belum ada, tambahkan langsung ke collection
      const refDokumen = await addDoc(collection(basisdata, "transaksi"), {
        idbarang: idbarang,
        nama: nama,
        harga: harga,
        jumlah: jumlah,
        idpelanggan: idpelanggan,
        namapelanggan: namapelanggan
      })
    } else if (jumlahRecord == 1) {
      // kalau sudah ada, tambahkan jumlahnya saja
      jumlahSebelumnya++
      await updateDoc(doc(basisdata, "transaksi", idtransaksi), { jumlah: jumlahSebelumnya })
    }
    
    // menampilkan pesan berhasil
    console.log("berhasil menyimpan keranjang")
  } catch (error) {
    // menampilkan pesan gagal
    console.log(error)
  }
}

// menampilkan barang di keranjang
export async function ambilDaftarBarangDiKeranjang() {
  const refDokumen = collection(basisdata, "transaksi");
  const kueri = query(refDokumen, orderBy("nama"));
  const cuplikanKueri = await getDocs(kueri);
  
  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      nama: dokumen.data().nama,
      jumlah: dokumen.data().jumlah,
      harga: dokumen.data().harga
    })
  })
  
  return hasilKueri;
}

export async function hapusBarangDariKeranjang(id) {
  await deleteDoc(doc(basisdata, "transaksi", id))
}