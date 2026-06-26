import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { greenBlockLogo, mushroomGrowingImg, diagramFlow, labGreenBlockVideo } from "../../assets";
import { WaveDivider } from "./home/shared";
import { HeroSection } from "./home/components/HeroSection";
import { CoreFeaturesSection } from "./home/components/CoreFeaturesSection";
import { LabSection } from "./home/components/LabSection";
import { LeaderboardSection } from "./home/components/LeaderboardSection";
import { RegisterBenefitsSection } from "./home/components/RegisterBenefitsSection";
import { PurchaseBenefitsSection } from "./home/components/PurchaseBenefitsSection";
import { HowItWorksSection } from "./home/components/HowItWorksSection";
import { CertificationSection } from "./home/components/CertificationSection";
import { CtaSection } from "./home/components/CtaSection";

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    [greenBlockLogo, mushroomGrowingImg, diagramFlow, labGreenBlockVideo].forEach((asset) => {
      if (asset.endsWith(".mp4")) {
        const video = document.createElement("video");
        video.src = asset;
        video.preload = "auto";
      } else {
        const img = new Image();
        img.src = asset;
      }
    });
  }, []);

  return (
    <div style={{ fontFamily: "Nunito, sans-serif", overflowX: "hidden" }}>
      <HeroSection navigate={navigate} />
      <WaveDivider topColor="#D8F3DC" bottomColor="white" />

      <CoreFeaturesSection />
      <WaveDivider topColor="white" bottomColor="#F0FDF4" />

      <LabSection />
      <WaveDivider topColor="#F0FDF4" bottomColor="#F8F4EF" />

      <LeaderboardSection />
      <WaveDivider topColor="#F8F4EF" bottomColor="#F8F4EF" />

      <RegisterBenefitsSection navigate={navigate} user={user} />
      <WaveDivider topColor="#F8F4EF" bottomColor="#1B4332" />

      <PurchaseBenefitsSection navigate={navigate} />
      <WaveDivider topColor="#1B4332" bottomColor="white" />

      <HowItWorksSection />
      <WaveDivider topColor="white" bottomColor="#FFF7ED" />

      <CertificationSection />
      <WaveDivider topColor="#FFF7ED" bottomColor="#D8F3DC" />

      <CtaSection navigate={navigate} user={user} />
    </div>
  );
}
