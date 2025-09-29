import { Archivo, Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar"; 

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], 
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], 
});

export const metadata = {
  title: "Cinema E-Booking Site",
 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${montserrat.variable}`}>
       <NavBar />
        {children}
      </body>
    </html>
  );
}
