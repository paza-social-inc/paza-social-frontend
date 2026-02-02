import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Job } from '@/types';
import { RiCameraLine, RiMoneyDollarCircleLine, RiMedalLine, RiTimeLine, RiTeamLine, RiMapPinLine, RiGlobeLine } from '@remixicon/react';

interface JobProps extends Job {
    onClick: () => void;
    imageUrl: string;
}

const JobCard = ({
    _id,
    values,
    skills = [],
    contents = [],
    platforms = [],
    proposals = [],
    imageUrl = "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2069&q=80",
    onClick,
}: JobProps) => {
    const {
        title,
        description,
        payment,
        paymentdesc,
        location,
        experience,
        years,
        age,
        category,
        priority,
    } = values ?? {};

    // Format payment display
    const getPaymentDisplay = () => {
        if (payment === 'Subscription Based') {
            return paymentdesc || 'Subscription';
        }
        if (payment && !isNaN(Number(payment))) {
            return `ksh.${payment}`;
        }
        return payment || 'Negotiable';
    };

    // Get highest proposal fee
    const getHighestProposal = () => {
        if (proposals && proposals.length > 0) {
            const highest = Math.max(...proposals.map(p => parseFloat(p.fee) || 0));
            return highest > 0 ? `$${highest}` : null;
        }
        return null;
    };

    const displayPayment = getHighestProposal() || getPaymentDisplay();

    // Priority badge variant
    const getPriorityVariant = () => {
        if (priority === 'High') return 'destructive';
        if (priority === 'Medium') return 'secondary';
        return 'default';
    };

    const InfoItem = ({ icon, label, value, bgColor }: any) => (
        <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${bgColor}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">{value || 'N/A'}</p>
            </div>
        </div>
    );

    return (
        <Card
            id={_id}
            className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary  rounded-xl !pt-0 !pb-1"
            onClick={onClick}
        >
            <CardHeader className="p-0">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="absolute top-4 left-4 flex gap-2">
                            {priority && (
                                <Badge
                                    variant={getPriorityVariant()}
                                    className={`px-3 py-1 text-xs font-medium ${priority === 'High'
                                        ? 'bg-red-500 text-white'
                                        : priority === 'Medium'
                                            ? 'bg-yellow-500 text-black'
                                            : 'bg-green-500 text-white'
                                        }`}
                                >
                                    {priority}
                                </Badge>
                            )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h2 className="text-xl font-bold line-clamp-2 text-white">{title || 'Untitled Job'}</h2>
                            <div className="mt-2 flex items-center text-sm">
                                <RiMapPinLine className="mr-2 h-4 w-4 text-blue-300" />
                                <span className="text-gray-200">{location || 'Remote'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 py-3 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                        icon={<RiMoneyDollarCircleLine className="h-5 w-5" />}
                        label={getHighestProposal() ? 'Best Proposal' : 'Payment'}
                        value={displayPayment}
                        bgColor="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                    />
                    <InfoItem
                        icon={<RiMedalLine className="h-5 w-5" />}
                        label="Experience"
                        value={experience}
                        bgColor="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    />
                    <InfoItem
                        icon={<RiTimeLine className="h-5 w-5" />}
                        label="Years"
                        value={years}
                        bgColor="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                    />
                    <InfoItem
                        icon={<RiTeamLine className="h-5 w-5" />}
                        label="Age Range"
                        value={age}
                        bgColor="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                    />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {description || 'No description provided.'}
                </p>

                {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 4).map((skill, index) => (
                            <Badge
                                key={index}
                                className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 text-xs font-medium hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-900/30 dark:hover:text-orange-400"
                            >
                                {skill}
                            </Badge>
                        ))}
                        {skills.length > 4 && (
                            <Badge className="bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300 px-3 py-1 text-xs">
                                +{skills.length - 4} more
                            </Badge>
                        )}
                    </div>
                )}

                {(contents.length > 0 || platforms.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                        {contents.map((content, index) => (
                            <Badge
                                key={`content-${index}`}
                                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 px-3 py-1 text-xs font-medium"
                            >
                                <RiCameraLine className="mr-1 h-4 w-4" />
                                {content}
                            </Badge>
                        ))}
                        {platforms.map((platform, index) => (
                            <Badge
                                key={`platform-${index}`}
                                className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 px-3 py-1 text-xs font-medium"
                            >
                                <RiGlobeLine className="mr-1 h-4 w-4" />
                                {platform}
                            </Badge>
                        ))}
                    </div>
                )}

                {proposals && proposals.length > 0 && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="mr-2 h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 4v16h14V8h-6V4H5zm7 2h5v5l-2-2-3 3-2-2 3-3zm-7 4h6v2H5v-2zm0 4h6v2H5v-2z" />
                        </svg>
                        <span>{proposals.length} proposal{proposals.length !== 1 ? 's' : ''} received</span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 mt-auto pt-0 !px-4 flex items-center justify-between">
               
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    className="w-full"
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
};

export default JobCard;
