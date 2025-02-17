'use client'

import { useState } from "react";
import { toast } from "react-hot-toast"
import { BannerType } from "@/app/types/page"
import usePortada from "../hooks/usePortada";
import Button from "@/app/components/Button";
import Banner from "./Banner";

interface BannersSelectorProps {
  id: string
  pageName?: string
  current: BannerType[]
}

const BannersSelector = ({id, current, pageName}: BannersSelectorProps) => {
  const [currentBanners, setCurrentBanners] = useState(current)
  const [addingBanner, setAddingBanner] = useState(false)
  const {saveBanners}= usePortada()
  
  const handleChangeBanner = async (banner: BannerType) => {
    let newCurrentBanners: BannerType[]
    console.log("banner changed", banner)
    const alreadyAdded = currentBanners.find(i => i?._id === banner?._id)
    if (alreadyAdded) {
      newCurrentBanners = currentBanners.map(i => i._id === banner._id ? banner : i)
    } else {
      newCurrentBanners = [...currentBanners, banner]
    }

    setCurrentBanners(newCurrentBanners)
    saveBanners(newCurrentBanners, id).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        setAddingBanner(false)
        toast.success("banner de portada actualizado correctamente")
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <h5>Banners</h5>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          {currentBanners.map((i, idx) => (
            <Banner key={"banner-item-"+idx} item={i} onChange={handleChangeBanner} pageName={pageName} />
          ))}
        </div>
        {
          addingBanner && (
            <Banner item={null} onChange={handleChangeBanner} pageName={pageName} />
          )
        }
      </div>
      {!addingBanner && (
        <div>
          <Button
            onClick={() => setAddingBanner(true)}
          >
            Agregar un Banner
          </Button>
        </div>
      )}
    </div>
 )
}

export default BannersSelector