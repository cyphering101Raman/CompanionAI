import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="w-full flex justify-center py-6">
            <nav className="w-[80%] max-w-3xl flex justify-center items-center px-6 py-3 rounded-full bg-[#FFFFFF33] backdrop-blur-lg border border-[#FFFFFF1A] shadow-[0_4px_22px_#2B1F49]">
                <Link
                    to="/"
                    className="text-xl font-semibold text-[#E9E9F3] hover:text-[#F4E96D] transition text-center"
                >
                    CompanionAI
                </Link>
            </nav>
        </div>
    );
}
