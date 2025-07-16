import { useState } from "react";

export default function ImageInput({
    id = "image-input",
    label = "Upload Image",
    accept = "image/png, image/jpeg, image/jpg, image/gif",
    maxSizeMB = 2,
    onChange,
    helperText = "",
    className = "w-full max-w-sm mx-auto"
}) {
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setFileName("");
            if (onChange) onChange(null);
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`File size exceeds ${maxSizeMB} MB limit.`);
            e.target.value = null; // reset input
            setFileName("");
            if (onChange) onChange(null);
            return;
        }

        setFileName(file.name);
        if (onChange) onChange(file);
    };

    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {label}
            </label>
            <input
                id={id}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50
                   dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                {fileName || helperText || `Allowed formats: PNG, JPG, GIF. Max size: ${maxSizeMB}MB.`}
            </p>
        </div>
    );
}
