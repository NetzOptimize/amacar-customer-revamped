import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Car,
  Gavel,
  ArrowDown,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState(new Set());
  const navigate = useNavigate();
  const faqData = [
    {
      category: "Appraisal FAQs",
      icon: <Car className="h-5 w-5" />,
      color: "from-blue-500 to-indigo-500",
      items: [
        {
          id: "appraisal-1",
          question: "What is Amacar?",
          answer:
            "Amacar is a digital vehicle appraisal and live auction platform that connects individual sellers with verified dealerships. Users can get an online vehicle valuation, enter their car into a dealer auction, and accept the best live bid—all from the comfort of home.",
        },
        {
          id: "appraisal-2",
          question: "How do I Appraise my vehicle?",
          answer:
            "Enter your vehicle's VIN, mileage, condition, and photos. Amacar's appraisal engine generates an estimated valuation based on current market trends and numerous sources. This estimate offer serves as a pricing guide before entering the auction.",
        },
        {
          id: "appraisal-3",
          question: "How often is your appraisal data updated?",
          answer:
            "Our system refreshes daily to reflect changes in dealer inventory, consumer demand, and market pricing patterns—ensuring your appraisal stays current.",
        },
        {
          id: "appraisal-4",
          question: "Why is my vehicle not eligible for a Price?",
          answer:
            "If a vehicle has an unrecognized VIN, insufficient market data, or is extremely rare or new, an online appraisal may not be possible. We recommend scheduling an in-person appraisal with the participating dealership in these cases.",
        },
      ],
    },
    {
      category: "Auction FAQs",
      icon: <Gavel className="h-5 w-5" />,
      color: "from-orange-500 to-red-500",
      items: [
        {
          id: "auction-1",
          question: "What if no dealer places a bid on my vehicle?",
          answer:
            "If the auction ends with no bids, your listing simply expires. You can relist the vehicle, revise details for a fresh appraisal, or schedule an in-person visit with a local dealer.",
        },
        {
          id: "auction-2",
          question: "Do I have to pay to use Amacar?",
          answer:
            "No. There's no fee for appraisals, listings, or auction participation. If you accept a bid, the transaction is handled directly with the dealer—Amacar charges no commission to you.",
        },
      ],
    },
    // {
    //   category: 'Reverse Bidding FAQs',
    //   icon: <ArrowDown className="h-5 w-5" />,
    //   color: 'from-green-500 to-emerald-500',
    //   items: [
    //     {
    //       id: 'reverse-1',
    //       question: 'What is Amacar\'s Reverse Bidding Process?',
    //       answer: 'Amacar\'s reverse bidding process allows dealerships to compete by lowering their prices on a new or pre-owned vehicle you\'re interested in. Instead of customers driving dealer to dealer for the best price, verified dealers reduce their offers to win your business and helping you get the best deal.'
    //     },
    //     {
    //       id: 'reverse-2',
    //       question: 'How do I start a reverse bidding process?',
    //       answer: 'Navigate through Amacar.ai online inventory list including make, model, trim, and any preferences — Send your request to Amacar\'s network of participating dealerships. The bidding window then opens and dealers begin lowering their prices in real time. Amacar may also offer you other alternative makes and models that can meet your standards to get you the most competitive deal across multiple brands.'
    //     },
    //     {
    //       id: 'reverse-3',
    //       question: 'How long does the bidding window last?',
    //       answer: 'Each reverse bidding typically lasts between 1 to 4 hours, depending on the vehicle and region. You\'ll receive alerts as bids coming in, and you can choose to accept a final offer before the window closes. Keep in mind, the offer may expire with minutes, hours or days depending on the dealer\'s available incentives, bonus, or manufacturer\'s special programs and assigned discounts or expiration of the special offers or inventory availability.'
    //     },
    //     {
    //       id: 'reverse-4',
    //       question: 'Can I reject all the bids?',
    //       answer: 'Yes. You are under no obligation to accept a bid. If you don\'t find a deal that fits your expectations, you can decline all offers or start the process again by searching the Amacar.ai online inventory. Keep in mind, the offers you receive may be the best offers in the market as dealers are competing to win your business.'
    //     },
    //     {
    //       id: 'reverse-5',
    //       question: 'How is the winning dealer selected?',
    //       answer: 'The dealer offering the lowest qualifying price is shown as the leading bid or as top 5 offers. You choose whether to accept or decline it. If no action is taken, offers may expire automatically for several reasons mentioned earlier.'
    //     },
    //     {
    //       id: 'reverse-6',
    //       question: 'Do I need to visit the dealership in person?',
    //       answer: 'Often yes—for test drives, paperwork, or trade-in inspections. Some dealers may offer remote paperwork or delivery, depending on your location and their capabilities and both party\'s agreement.'
    //     },
    //     {
    //       id: 'reverse-7',
    //       question: 'Are reverse bidding prices final?',
    //       answer: 'The bid reflects the final offer before taxes and fees. Confirm the final "out-the-door" price with the dealer to include taxes, registration, DMV Electronic fee and other optional add-ons.'
    //     },
    //     {
    //       id: 'reverse-8',
    //       question: 'What fees are included in dealer offers?',
    //       answer: 'Dealer offers shown on the Amacar platform reflect only the vehicle\'s sale price as submitted by the bidding dealership. Taxes, Doc fee, DMV fees, DMV Electronic fee, or any other charges including but not limit to any aftermarket products or dealer add-ons are not included in the bid amount. These additional costs, if applicable, are disclosed by the dealer after you accept the offer and proceed to finalize the transaction.'
    //     },
    //     {
    //       id: 'reverse-9',
    //       question: 'Does Amacar consider dealer promotions or incentives?',
    //       answer: 'Amacar does not offer or apply any special incentives. Our platform simply facilitates the lowest sales price through dealer competition in the reverse bidding process. If a participating dealer chooses to offer additional bonuses, trade-in credits, or manufacturer incentives, they may communicate those details directly with you via email, chat, or during final negotiations'
    //     },
    //     {
    //       id: 'reverse-10',
    //       question: 'Can I opt out of extra offers, except for government fees?',
    //       answer: 'Yes. You may purchase the car at the agreed-upon auction price and only pay the required government fees directly at the dealership.'
    //     }
    //   ]
    // }
  ];

  const toggleItem = (itemId) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return faqData;

    return faqData
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [searchTerm, faqData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 mt-[1rem]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 mt-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)} // or your navigate logic
          className="cursor-pointer shadow-md rounded-lg px-4 py-2 flex items-center text-slate-700 hover:text-slate-900 font-medium mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
            <HelpCircle className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about Amacar's vehicle appraisal,
            auction, and reverse bidding services.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-lg"
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-8">
          {filteredData.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            >
              {/* Category Header */}
              <div className={`bg-gradient-to-r ${category.color} p-6`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {category.category}
                  </h2>
                </div>
              </div>

              {/* FAQ Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-slate-800 text-lg pr-4">
                          {item.question}
                        </span>
                        <div className="flex-shrink-0">
                          {openItems.has(item.id) ? (
                            <ChevronUp className="h-5 w-5 text-slate-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                          )}
                        </div>
                      </button>

                      {openItems.has(item.id) && (
                        <div className="px-6 pb-4 border-t border-slate-100">
                          <p className="text-slate-600 leading-relaxed pt-4">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No results found
            </h3>
            <p className="text-slate-500">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
