export default function CustomModal({
    isOpen,
    onClose,
    title = "Modal Title",
    description,
    submitText = "Submit",
    onSubmit,
    children,
    showFooter = true,
}) {
    if (!isOpen) return null;

    return (
        <div className="m-0 fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold dark:text-gray-100">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                {description && (
                    <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>
                )}
                {children}

                {/* Footer with actions */}
                {showFooter && (
                    <div className="mt-6 flex justify-end space-x-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            {submitText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
