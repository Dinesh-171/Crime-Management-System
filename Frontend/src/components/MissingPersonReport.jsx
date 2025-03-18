import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const MissingPersonReport = () => {
    const Username=sessionStorage.getItem('UserName')
    const Name=sessionStorage.getItem('Name')
    const Email=sessionStorage.getItem('Email')
const nevigate=useNavigate()
     useEffect(()=>{
        if (!Username) {
          nevigate('/login')
        }
      },[Username]);
    const [formData, setFormData] = useState({
        username: Username,
        missingPerson: {
            fullName: "",
            age: "",
            photo: "",
            contact: "",
        },
        lastSeenDetails: {
            location: "",
            pincode: "",
            date: "",
        },
        status: 'Open',
        assignedOfficer: {
            UserName: '',
            Name: '',
            contact: ''
        }
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState(false);
    const [errors, setErrors] = useState([]);
    const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
    const [showError, setShowError] = useState(false);
    const [acknowledgment, setAcknowledgment] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNestedChange = (e, section) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value,
            },
        }));
    };

    const generateAcknowledgmentNumber = () => {
        const now = new Date();
        const formattedDate = now
            .toISOString()
            .replace(/[-T:.Z]/g, "")
            .slice(0, 14);
        return `CMS${formattedDate}`;
    };

    const validateForm = () => {
        let newErrors = [];
        const today = new Date().toISOString().split("T")[0];

        // Username validation
        if (!formData.username || formData.username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.push("Username must be at least 3 characters long and contain only letters, numbers, or underscores.");
        }

        // Full Name validation
        if (!formData.missingPerson.fullName || formData.missingPerson.fullName.length < 3 || !/^[a-zA-Z\s]+$/.test(formData.missingPerson.fullName)) {
            newErrors.push("Full name must be at least 3 characters long and contain only letters and spaces.");
        }

        // Age validation
        if (!formData.missingPerson.age || isNaN(formData.missingPerson.age) || formData.missingPerson.age <= 0 || formData.missingPerson.age > 120) {
            newErrors.push("Age must be a number between 1 and 120.");
        }

        // Photo validation
        // if (!formData.missingPerson.photo) {
        //   newErrors.push("Please upload a valid image file.");
        // }

        // Contact Number validation
        if (!formData.missingPerson.contact || !/^[0-9]{10}$/.test(formData.missingPerson.contact)) {
            newErrors.push("Enter a valid 10-digit contact number.");
        }

        // Last Seen Location validation
        if (!formData.lastSeenDetails.location) {
            newErrors.push("Location is required.");
        }

        // Pincode validation
        if (!formData.lastSeenDetails.pincode || !/^[0-9]{6}$/.test(formData.lastSeenDetails.pincode)) {
            newErrors.push("Pincode must be a 6-digit number.");
        }

        // Date validation
        if (!formData.lastSeenDetails.date || formData.lastSeenDetails.date > today) {
            newErrors.push("Date cannot be in the future.");
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            setCurrentErrorIndex(0);
            setShowError(true);
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (showError && errors.length > 0) {
            const timer = setTimeout(() => {
                if (currentErrorIndex < errors.length - 1) {
                    setCurrentErrorIndex((prev) => prev + 1);
                } else {
                    setShowError(false);
                    setErrors([]);
                }
            }, 5000); // Show each error for 5 seconds

            return () => clearTimeout(timer);
        }
    }, [showError, currentErrorIndex, errors]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const acknowledgmentNumber = generateAcknowledgmentNumber();
            setAcknowledgment(acknowledgmentNumber);
            try {
                const Subject=`Subject: Missing Report Acknowledgment – Stay Strong. ${acknowledgmentNumber}`
                const Message=`
    Dear ${Name},

We have successfully received your missing person report. Your acknowledgment number is ${acknowledgmentNumber}. Please keep this number safe for future reference.

Current Status: Your report is under initial review and is currently waiting for officer assignment. Our dedicated team is actively working on your case, and you will be notified as soon as an officer is assigned.

You can track the progress of your report anytime by visiting our website and checking the Status Section.

We understand that this is a challenging time, but please remember: Hope is stronger than fear. Our team is committed to assisting you, and we are doing everything possible to help reunite you with your loved one.

If you have any urgent concerns or additional details to share, please do not hesitate to contact us at departmentofcrime4049@gmail.com or call 100.

Stay strong. You are not alone in this—we are here for you.

Best regards,
Crime Reporting System Team
    `





                const response = await axios.post('http://localhost:8080/regmissing', {
                    ...formData,
                    acknowledgeNumber: acknowledgmentNumber
                });

                await axios.post('http://localhost:8080/sendGmail', {
                    gmail:Email,
                    text: Message,
                    Subject: Subject,
                  });
                setSubmissionError(false)
                setFormSubmitted(true);
                setFormData({
                    username: Username,
                    missingPerson: {
                        fullName: "",
                        age: "",
                        photo: "",
                        contact: "",
                    },
                    lastSeenDetails: {
                        location: "",
                        pincode: "",
                        date: "",
                    },
                    status: 'Open',
                    assignedOfficer: {
                        UserName: '',
                        Name: '',
                        contact: ''
                    }
                })
            } catch (error) {
                console.log(error);
              setSubmissionError(true)
                setFormSubmitted(false); // Set to false if there's an error
            }
            console.log("Form Submitted", formData);
        } else {
            setShowError(true);
        }
    };

    return (
        <div className="bg-black text-red-500 min-h-screen flex items-center p-6 pt-[120px] pb-[100px]">
            <div className="w-full max-w-5xl bg-gray-900 p-8 rounded-lg shadow-lg border border-red-500 flex ml-[230px]">
                {/* Left Side: Form */}
                <div className="w-1/2 pr-6 border-r border-red-500">
                    <h2 className="text-3xl font-bold text-center mb-6">Report a Missing Person</h2>
                    <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-6">
                        <input type="text" name="userame" placeholder="Your Username" value={formData.username} onChange={handleChange} className="mt-4 w-full h-[50px] bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
                        <input type="text" name="fullName" placeholder="Full Name" value={formData.missingPerson.fullName} onChange={(e) => handleNestedChange(e, "missingPerson")} className="p-3 w-full bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
                        <input type="number" name="age" placeholder="Age" value={formData.missingPerson.age} onChange={(e) => handleNestedChange(e, "missingPerson")} className="p-3 w-full bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
                        <input type="file" accept="image/*" className="p-3 w-full bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
                        <input type="text" name="contact" placeholder="Contact Number" value={formData.missingPerson.contact} onChange={(e) => handleNestedChange(e, "missingPerson")} className="p-3 w-full bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
                        <input type="text" name="location" placeholder="Last Seen Location" value={formData.lastSeenDetails.location} onChange={(e) => handleNestedChange(e, "lastSeenDetails")} className="p-3 w-full bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
                        <input type="text" name="pincode" placeholder="Pincode" value={formData.lastSeenDetails.pincode} onChange={(e) => handleNestedChange(e, "lastSeenDetails")} className="p-3 w-full bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
                        <input type="date" name="date" value={formData.lastSeenDetails.date} onChange={(e) => handleNestedChange(e, "lastSeenDetails")} className="p-3 w-full bg-gray-800 text-white border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
                        <button type="submit" className="col-span-2 p-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition">Report Missing Person</button>
                    </form>{formSubmitted &&
                    <div className="mt-6 text-center text-white text-lg font-bold">
                            ✅ Report Submitted Successfully! <br />
                            Acknowledgment Number: {acknowledgment}
                        </div>}
                     {submissionError && <p className="mt-4 text-red-500">❌ Something went wrong. Please try again.</p>}
 </div>

                {/* Right Side: Motivational Quote & Image */}
                <div className="w-1/2 flex flex-col justify-center items-center text-center p-6">
                    <p className="text-xl italic font-semibold text-white mb-4">“Every missing person is someone’s loved one. Let’s bring them home.”</p>
                    <img src="https://thumbs.dreamstime.com/b/3d-small-people-searching-27364925.jpg" alt="Searching for someone" className="w-72 h-72 object-cover border border-red-500 rounded-md" />
                </div>
            </div>
            {showError && (
                <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-md shadow-lg">
                    {errors[currentErrorIndex]}
                </div>
            )}
        </div>
    );
};

export default MissingPersonReport;