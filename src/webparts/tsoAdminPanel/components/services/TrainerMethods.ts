import { useEffect, useState } from "react";
import { web } from "../../PnpUrl";

// Utilities for Hyperlink and Picture field formatting (same pattern as Expenses)
const formatImageForHyperlinkPicture = (imageUrl: string, description: string = "Profile"): object | string => {
  if (!imageUrl) return "";
  return {
    "Description": description,
    "Url": imageUrl
  };
};

const parseImageFromHyperlinkPicture = (imageData: any): string | null => {
  if (!imageData) return null;
  if (typeof imageData === 'string') {
    try {
      const parsed = JSON.parse(imageData);
      return parsed.Url || parsed.url || parsed.serverRelativeUrl || imageData;
    } catch {
      return imageData;
    }
  } else if (typeof imageData === 'object') {
    return imageData.Url || imageData.url || imageData.serverRelativeUrl || null;
  }
  return null;
};

// Optional: upload profile image file to a picture library and return ServerRelativeUrl
const uploadProfileImageToLibrary = async (file: File): Promise<string> => {
  // Ensure a picture library exists to store trainer profile images
  const pictureLibrary = await web.lists.ensure('TrainerProfiles', 'Picture Library');
  const uploadResult = await pictureLibrary.list.rootFolder.files.add(file.name, file, true);
  return uploadResult.data.ServerRelativeUrl;
};

export type TrainerItem = {
  Id: number;
  Title?: string; // can be used as primary title if needed
  FullName?: string;
  Email?: string;
  Phone?: string;
  Address?: string;
  Gender?: string;
  Profile?: any;
  Expertise?: Array<{ Id: number; Title?: string }>; // expanded lookup
};

export function TrainerMethods() {
  const [trainerData, setTrainerData] = useState<any[]>([]);
  const [expertiseOptions, setExpertiseOptions] = useState<Array<{ Id: number; Title: string }>>([]);

  const fetchTrainers = async (): Promise<void> => {
    try {
      const res: TrainerItem[] = await web.lists
        .getByTitle("TsharperTrainer")
        .items
        .expand("Expertise")
        .select("Id", "Title", "FullName", "Phone", "Email", "Address", "Gender", "Profile", "Expertise/Id", "Expertise/Title")
        .get();

      const mapped = res.map((item) => ({
        ...item,
        ProfileUrl: parseImageFromHyperlinkPicture(item.Profile),
        ExpertiseIds: (item.Expertise || []).map(e => e.Id),
        ExpertiseTitles: (item.Expertise || []).map(e => e.Title).filter(Boolean)
      }));

      setTrainerData(mapped);
    } catch (error: any) {
      console.log("trainer data error :: ", error);
    }
  };

  const fetchExpertiseOptions = async (): Promise<void> => {
    try {
      // Assumes the lookup points to a list titled 'Expertise'
      const res = await web.lists.getByTitle('Expertise').items.select('Id', 'Title').get();
      setExpertiseOptions(res);
    } catch (error: any) {
      // If this list doesn't exist, silently ignore to avoid blocking trainers list
      console.log("fetch expertise options error :: ", error);
    }
  };

  useEffect(() => {
    fetchTrainers();
    fetchExpertiseOptions();
  }, []);

  type SavePayload = {
    Id?: number;
    FullName: string;
    Email?: string;
    Phone?: string;
    Address?: string;
    Gender?: string;
    // One of these for image:
    imageFile?: File; // if provided, will be uploaded
    imageUrl?: string; // direct URL if already hosted
    // Expertise lookup ids
    ExpertiseIds?: number[];
  };

  const buildTrainerSharePointPayload = async (payload: SavePayload): Promise<any> => {
    const data: any = {
      Title: payload.FullName || payload.Email || 'Trainer',
      FullName: payload.FullName,
      Email: payload.Email,
      Phone: payload.Phone,
      Address: payload.Address,
      Gender: payload.Gender
    };

    // Handle image
    try {
      if (payload.imageFile && payload.imageFile instanceof File) {
        const serverRelativeUrl = await uploadProfileImageToLibrary(payload.imageFile);
        data.Profile = formatImageForHyperlinkPicture(serverRelativeUrl, payload.FullName);
      } else if (payload.imageUrl) {
        data.Profile = formatImageForHyperlinkPicture(payload.imageUrl, payload.FullName);
      }
    } catch (imgErr) {
      console.log('profile image handling error :: ', imgErr);
    }

    // Handle Expertise multi-lookup if ids were provided
    if (payload.ExpertiseIds && Array.isArray(payload.ExpertiseIds)) {
      // sp-pnp-js expects multi-lookup as { results: number[] }
      data["ExpertiseId"] = { results: payload.ExpertiseIds };
    }

    return data;
  };

  const addTrainer = async (payload: SavePayload): Promise<void> => {
    try {
      const spData = await buildTrainerSharePointPayload(payload);
      const res = await web.lists.getByTitle("TsharperTrainer").items.add(spData);
      await fetchTrainers();
      console.log("Trainer added successfully", res.data);
    } catch (error: any) {
      console.log("add trainer error :: ", error);
    }
  };

  const updateTrainer = async (id: number, payload: SavePayload): Promise<void> => {
    try {
      const spData = await buildTrainerSharePointPayload({ ...payload, Id: id });
      const res = await web.lists.getByTitle("TsharperTrainer").items.getById(id).update(spData);
      await fetchTrainers();
      console.log("Trainer updated successfully", res.data);
    } catch (error: any) {
      console.log("update trainer error :: ", error);
    }
  };

  const deleteTrainer = async (id: number): Promise<void> => {
    try {
      await web.lists.getByTitle("TsharperTrainer").items.getById(id).delete();
      setTrainerData(prev => prev.filter(t => t.Id !== id));
    } catch (error: any) {
      console.log("delete trainer error :: ", error);
    }
  };

  return {
    trainerData,
    expertiseOptions,
    fetchTrainers,
    fetchExpertiseOptions,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    // export helpers for any other consumers
    parseImageFromHyperlinkPicture,
    formatImageForHyperlinkPicture
  };
}

