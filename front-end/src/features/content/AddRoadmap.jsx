import { useForm } from "react-hook-form";
import { useGetRoadmaps } from "../../hooks/courses/useGetRoadmaps";
import { useAddRoadmap } from "../../hooks/user/content-manager/useAddRoadmap";
import { FaPlus, FaImage } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "../../context/TranslationContext";

function AddRoadmap() {
  const { t } = useTranslation();
  const { roadmaps: { categories } = {} } = useGetRoadmaps();
  const [newCategory, setNewCategory] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
  );
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const { addRoadmap, isLoading } = useAddRoadmap();

  function onSubmit(data) {
    addRoadmap({
      ...data,
      image: previewImage,
    });
    reset();
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="font-body flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          {t("create_new_roadmap")}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex-1 space-y-6">
              <div>
                {newCategory ? (
                  <input
                    type="text"
                    placeholder={t("enter_new_category")}
                    className="border-primary-600 focus:border-primary-500 w-full rounded-lg border-2 bg-white/5 p-3 text-white transition-colors outline-none"
                    {...register("category", {
                      required: t("category_required"),
                    })}
                  />
                ) : (
                  <select
                    className="border-primary-600 focus:border-primary-500 w-full rounded-lg border-2 bg-white/10 p-3 text-white transition-colors outline-none focus:bg-black"
                    {...register("category", {
                      required: t("category_required"),
                    })}
                    onChange={(e) => {
                      if (e.target.value === "other") {
                        setNewCategory(true);
                        e.target.value = ""; // Clear the select value
                      }
                    }}
                  >
                    <option value="">{t("select_category")}</option>
                    {categories?.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="other">{t("add_new_category")}</option>
                  </select>
                )}
                {errors.category && (
                  <span className="text-sm text-red-500">
                    {errors.category.message}
                  </span>
                )}
              </div>

              <input
                type="text"
                placeholder={t("roadmap_title")}
                className="border-primary-600 focus:border-primary-500 w-full rounded-lg border-2 bg-white/5 p-3 text-xl text-white transition-colors outline-none"
                {...register("title", { required: t("title_required") })}
              />
              {errors.title && (
                <span className="text-sm text-red-500">
                  {errors.title.message}
                </span>
              )}

              <textarea
                placeholder={t("roadmap_description")}
                className="border-primary-600 focus:border-primary-500 min-h-[100px] w-full rounded-lg border-2 bg-white/5 p-3 text-white transition-colors outline-none"
                {...register("description", {
                  required: t("description_required"),
                })}
              />
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2 rounded-lg px-8 py-3 font-semibold text-white transition-colors"
            >
              {isLoading ? (
                t("creating")
              ) : (
                <>
                  <FaPlus /> {t("create_roadmap")}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default AddRoadmap;
