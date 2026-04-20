
// "use client"
//
// import React, { useState, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// import { Slider } from '@/components/ui/slider';
// import JobCard from '../JobCard';
// // import { mockJobs } from '@/lib/data/jobs';
// import { RiAddLine, RiCloseLine, RiFilterLine, RiSearchLine } from '@remixicon/react';
//
// const MyJobBoard = () => {
//     const router = useRouter();
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortBy, setSortBy] = useState('recent');
//     const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//     const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
//     const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
//     const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
//     const [paymentRange, setPaymentRange] = useState<number[]>([0, 100000]);
//
//     const categories = [...new Set(mockJobs.map(job => job.values.category).filter(Boolean))];
//     const experiences = [...new Set(mockJobs.map(job => job.values.experience).filter(Boolean))];
//     const priorities = ['High', 'Medium', 'Low'];
//     const locations = [...new Set(mockJobs.map(job => job.values.location).filter(Boolean))];
//
//     const filteredAndSortedJobs = useMemo(() => {
//         let filtered = mockJobs.filter(job => {
//             const matchesSearch = !searchTerm ||
//                 job.values.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 job.values.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
//
//             const matchesCategory = selectedCategories.length === 0 ||
//                 selectedCategories.includes(job?.values?.category);
//
//             const matchesExperience = selectedExperience.length === 0 ||
//                 selectedExperience.includes(job.values.experience);
//
//             const matchesPriority = selectedPriority.length === 0 ||
//                 selectedPriority.includes(job.values.priority);
//
//             const matchesLocation = selectedLocations.length === 0 ||
//                 selectedLocations.includes(job.values.location);
//
//             const payment = parseFloat(job.values.payment) || 0;
//             const matchesPayment = payment >= paymentRange[0] && payment <= paymentRange[1];
//
//             return matchesSearch && matchesCategory && matchesExperience &&
//                 matchesPriority && matchesLocation && matchesPayment;
//         });
//
//         filtered.sort((a, b) => {
//             if (sortBy === 'payment-high') {
//                 return (parseFloat(b.values.payment) || 0) - (parseFloat(a.values.payment) || 0);
//             }
//             if (sortBy === 'payment-low') {
//                 return (parseFloat(a.values.payment) || 0) - (parseFloat(b.values.payment) || 0);
//             }
//             if (sortBy === 'proposals') {
//                 return (b.proposals?.length || 0) - (a.proposals?.length || 0);
//             }
//             return 0;
//         });
//
//         return filtered;
//     }, [searchTerm, sortBy, selectedCategories, selectedExperience, selectedPriority, selectedLocations, paymentRange]);
//
//     const toggleFilter = (filterArray: string[], setFilterArray: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
//         if (filterArray.includes(value)) {
//             setFilterArray(filterArray.filter((item) => item !== value));
//         } else {
//             setFilterArray([...filterArray, value]);
//         }
//     };
//
//     const clearAllFilters = () => {
//         setSelectedCategories([]);
//         setSelectedExperience([]);
//         setSelectedPriority([]);
//         setSelectedLocations([]);
//         setPaymentRange([0, 100000]);
//         setSearchTerm('');
//     };
//
//     const activeFiltersCount = selectedCategories.length + selectedExperience.length +
//         selectedPriority.length + selectedLocations.length;
//
//     return (
//         <div className="min-h-screen bg-background ">
//             {/* Header */}
//             <div className="bg-background border sticky top-0 z-10 shadow-sm">
//                 <div className="container mx-auto px-4 py-6">
//                     <div className="flex items-start justify-between mb-4">
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Jobs</h1>
//                             <p className="text-gray-600 dark:text-gray-400 mt-1">
//                                 {filteredAndSortedJobs.length} jobs available
//                             </p>
//                         </div>
//                         <Button>
//                             <RiAddLine className='h-5 w-5' />
//                             Create Job
//                         </Button>
//                     </div>
//
//                     {/* Search and Sort Bar */}
//                     <div className="flex flex-col md:flex-row gap-4">
//                         <div className="flex-1 relative">
//                             <RiSearchLine className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
//                             <Input
//                                 type="text"
//                                 placeholder="Search jobs, skills, or keywords..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10"
//                             />
//                         </div>
//
//                         <Select value={sortBy} onValueChange={setSortBy}>
//                             <SelectTrigger className="w-full md:w-[200px]">
//                                 <SelectValue placeholder="Sort by" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="recent">Most Recent</SelectItem>
//                                 <SelectItem value="payment-high">Highest Payment</SelectItem>
//                                 <SelectItem value="payment-low">Lowest Payment</SelectItem>
//                                 <SelectItem value="proposals">Most Proposals</SelectItem>
//                             </SelectContent>
//                         </Select>
//
//                         <Sheet>
//                             <SheetTrigger asChild>
//                                 <Button variant="outline" className="relative flex items-center">
//                                     <RiFilterLine className="w-5 h-5" />
//                                     <span className="font-medium">Filters</span>
//                                     {activeFiltersCount > 0 && (
//                                         <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                                             {activeFiltersCount}
//                                         </Badge>
//                                     )}
//                                 </Button>
//                             </SheetTrigger>
//                             <SheetContent className="w-full max-w-md p-6  overflow-y-auto ">
//                                 <SheetHeader className="mb-6 !px-0">
//                                     <SheetTitle className="text-2xl font-bold">Filter Jobs</SheetTitle>
//                                     <SheetDescription>
//                                         Refine your job search like a pro
//                                     </SheetDescription>
//                                 </SheetHeader>
//
//                                 <div className="space-y-8">
//                                     {/* Category Filter */}
//                                     <div>
//                                         <div className="flex items-center justify-between mb-4">
//                                             <Label className="text-lg font-semibold">Category</Label>
//                                             {selectedCategories.length > 0 && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     onClick={() => setSelectedCategories([])}
//                                                 >
//                                                     Clear
//                                                 </Button>
//                                             )}
//                                         </div>
//                                         <div className="space-y-3">
//                                             {categories.map(category => (
//                                                 <div key={category} className="flex items-center space-x-3">
//                                                     <Checkbox
//                                                         id={category}
//                                                         checked={selectedCategories.includes(category)}
//                                                         onCheckedChange={() => toggleFilter(selectedCategories, setSelectedCategories, category)}
//                                                         className="h-5 w-5"
//                                                     />
//                                                     <Label htmlFor={category} className="cursor-pointer">
//                                                         {category}
//                                                     </Label>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//
//                                     {/* Experience Filter */}
//                                     <div>
//                                         <div className="flex items-center justify-between mb-4">
//                                             <Label className="text-lg font-semibold">Experience Level</Label>
//                                             {selectedExperience.length > 0 && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     onClick={() => setSelectedExperience([])}
//                                                 >
//                                                     Clear
//                                                 </Button>
//                                             )}
//                                         </div>
//                                         <div className="space-y-3">
//                                             {experiences.map(exp => (
//                                                 <div key={exp} className="flex items-center space-x-3">
//                                                     <Checkbox
//                                                         id={exp}
//                                                         checked={selectedExperience.includes(exp)}
//                                                         onCheckedChange={() => toggleFilter(selectedExperience, setSelectedExperience, exp)}
//                                                         className="h-5 w-5 "
//                                                     />
//                                                     <Label htmlFor={exp} className="cursor-pointer">
//                                                         {exp}
//                                                     </Label>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//
//                                     {/* Priority Filter */}
//                                     <div>
//                                         <div className="flex items-center justify-between mb-4">
//                                             <Label className="text-lg font-semibold">Priority</Label>
//                                             {selectedPriority.length > 0 && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     onClick={() => setSelectedPriority([])}
//                                                 >
//                                                     Clear
//                                                 </Button>
//                                             )}
//                                         </div>
//                                         <div className="space-y-3">
//                                             {priorities.map(priority => (
//                                                 <div key={priority} className="flex items-center space-x-3">
//                                                     <Checkbox
//                                                         id={priority}
//                                                         checked={selectedPriority.includes(priority)}
//                                                         onCheckedChange={() => toggleFilter(selectedPriority, setSelectedPriority, priority)}
//                                                         className="h-5 w-5"
//                                                     />
//                                                     <Label htmlFor={priority} className="cursor-pointer">
//                                                         {priority}
//                                                     </Label>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//
//                                     {/* Location Filter */}
//                                     <div>
//                                         <div className="flex items-center justify-between mb-4">
//                                             <Label className="text-lg font-semibold">Location</Label>
//                                             {selectedLocations.length > 0 && (
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     onClick={() => setSelectedLocations([])}
//                                                 >
//                                                     Clear
//                                                 </Button>
//                                             )}
//                                         </div>
//                                         <div className="space-y-3">
//                                             {locations.map(location => (
//                                                 <div key={location} className="flex items-center space-x-3">
//                                                     <Checkbox
//                                                         id={location}
//                                                         checked={selectedLocations.includes(location)}
//                                                         onCheckedChange={() => toggleFilter(selectedLocations, setSelectedLocations, location)}
//                                                         className="h-5 w-5"
//                                                     />
//                                                     <Label htmlFor={location} className="cursor-pointer">
//                                                         {location}
//                                                     </Label>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//
//                                     {/* Payment Range */}
//                                     <div>
//                                         <Label className="text-lg font-semibold">
//                                             Payment Range: KSh {paymentRange[0].toLocaleString()} - KSh {paymentRange[1].toLocaleString()}
//                                         </Label>
//                                         <Slider
//                                             min={0}
//                                             max={100000}
//                                             step={5000}
//                                             value={paymentRange}
//                                             onValueChange={setPaymentRange}
//                                             className="mt-4"
//                                         />
//                                     </div>
//
//                                     {/* Clear All */}
//                                     {activeFiltersCount > 0 && (
//                                         <Button
//                                             onClick={clearAllFilters}
//                                             variant="outline"
//                                             className="w-full py-3 border-2 border-gray-200 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg font-semibold"
//                                         >
//                                             Clear All Filters
//                                         </Button>
//                                     )}
//                                 </div>
//                             </SheetContent>
//                         </Sheet>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Active Filters */}
//             {activeFiltersCount > 0 && (
//                 <div className="container mx-auto px-4 py-4">
//                     <div className="flex flex-wrap gap-2 items-center">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
//                         {selectedCategories.map(cat => (
//                             <Badge key={cat} variant="secondary" className="gap-1 p-1">
//                                 {cat}
//                                 <RiCloseLine
//                                     onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
//                                     className='cursor-pointer ml-1 h-4 w-4' />
//                             </Badge>
//                         ))}
//                         {selectedExperience.map(exp => (
//                             <Badge key={exp} variant="secondary" className="gap-1 p-1">
//                                 {exp}
//                                 <RiCloseLine
//                                     className="cursor-pointer ml-1 h-4 w-4"
//                                     onClick={() => toggleFilter(selectedExperience, setSelectedExperience, exp)}
//                                 />
//                             </Badge>
//                         ))}
//                         {selectedPriority.map(pri => (
//                             <Badge key={pri} variant="secondary" className="gap-1 p-1">
//                                 {pri}
//                                 <RiCloseLine
//                                     className="cursor-pointer ml-1 h-4 w-4"
//                                     onClick={() => toggleFilter(selectedPriority, setSelectedPriority, pri)}
//                                 />
//                             </Badge>
//                         ))}
//                         {selectedLocations.map(loc => (
//                             <Badge key={loc} variant="secondary" className="gap-1 p-1">
//                                 {loc}
//                                 <RiCloseLine
//                                     className="cursor-pointer ml-1 h-4 w-4"
//                                     onClick={() => toggleFilter(selectedLocations, setSelectedLocations, loc)}
//                                 />
//                             </Badge>
//                         ))}
//                     </div>
//                 </div>
//             )}
//
//             {/* Job Grid */}
//             <div className="container mx-auto py-8">
//                 {filteredAndSortedJobs.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {filteredAndSortedJobs.map(job => (
//                             <JobCard
//                                 key={job._id}
//                                 {...job}
//                                 onClick={() => router.push(`/jobs/${job._id}`)}
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-16 items-center flex flex-col">
//                         <RiSearchLine
//                             className="text-6xl text-gray-400 mb-4 h-10 w-10"
//                         />
//                         <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                             No jobs found
//                         </h3>
//                         <p className="text-gray-500 dark:text-gray-400 mb-4">
//                             Try adjusting your filters or search terms
//                         </p>
//                         <Button onClick={clearAllFilters} variant="outline">
//                             Clear All Filters
//                         </Button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default MyJobBoard;
//

"use client"

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/store/auth/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import JobCard from '../JobCard';
import EditJobModal from '../EditJobModal';
import { jobsApi } from '@/lib/data/jobs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { RiAddLine, RiCloseLine, RiFilterLine, RiSearchLine } from '@remixicon/react';
import { Loader2 } from 'lucide-react';

interface MyJobBoardProps {
    onOpenCreateJob?: () => void;
}

const MyJobBoard = ({ onOpenCreateJob }: MyJobBoardProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [editJobId, setEditJobId] = useState<number | null>(null);
    const [deleteJobId, setDeleteJobId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
    const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [paymentRange, setPaymentRange] = useState<number[]>([0, 100000]);

    const { data: jobsResponse, isLoading, isError } = useQuery({
        queryKey: ['jobs', 'owner', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            return await jobsApi.getByOwner(Number(user.id));
        },
        enabled: !!user?.id,
    });

    const deleteJobMutation = useMutation({
        mutationFn: (id: number) => jobsApi.delete(id),
        onSuccess: () => {
            toast.success('Job removed from the board');
            queryClient.invalidateQueries({ queryKey: ['jobs', 'owner', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            queryClient.invalidateQueries({ queryKey: ['user-jobs', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['all-user-jobs-stats', user?.id] });
            setDeleteJobId(null);
        },
        onError: (err: unknown) => {
            const res = err as { response?: { data?: { message?: string } } };
            toast.error(res.response?.data?.message ?? 'Failed to delete job');
        },
    });

    const mockJobs = useMemo(() => {
        if (!Array.isArray(jobsResponse)) return [];
        
        // Backend already returns flat structure, just add _id for compatibility
        return jobsResponse.map((job: any) => ({
            ...job,
            _id: String(job.id ?? job._id ?? ""), // Keep for backward compatibility with JobCard
            values: {
                title: job.values?.title ?? job.title,
                description: job.values?.description ?? job.description,
                category: job.values?.category ?? job.category,
                experience: job.values?.experience ?? job.experience,
                priority: job.values?.priority ?? job.priority,
                location: job.values?.location ?? job.location,
                payment: job.values?.payment ?? job.payment,
                age: job.values?.age ?? job.age,
                availability: job.values?.availability ?? job.availability,
                gender: job.values?.gender ?? job.gender,
                visibility: job.values?.visibility ?? job.visibility,
                paymentdesc: job.values?.paymentdesc ?? job.paymentdesc,
                link: job.values?.link ?? job.link,
                years: job.values?.years ?? job.years,
            }
        }));
    }, [jobsResponse]);

    const categories = [...new Set(mockJobs.map(job => job.values.category).filter(Boolean))];
    const experiences = [...new Set(mockJobs.map(job => job.values.experience).filter(Boolean))];
    const priorities = ['high', 'medium', 'low'];
    const locations = [...new Set(mockJobs.map(job => job.values.location).filter(Boolean))];

    const filteredAndSortedJobs = useMemo(() => {
        let filtered = mockJobs.filter(job => {
            const matchesSearch = !searchTerm ||
                job.values.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.values.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategories.length === 0 ||
                selectedCategories.includes(job?.values?.category);

            const matchesExperience = selectedExperience.length === 0 ||
                selectedExperience.includes(job.values.experience);

            const matchesPriority = selectedPriority.length === 0 ||
                selectedPriority.includes(job.values.priority?.toLowerCase()); 

            const matchesLocation = selectedLocations.length === 0 ||
                selectedLocations.includes(job.values.location);

            const payment = parseFloat(job.values.payment) || 0;
            const matchesPayment = payment >= paymentRange[0] && payment <= paymentRange[1];

            return matchesSearch && matchesCategory && matchesExperience &&
                matchesPriority && matchesLocation && matchesPayment;
        });

        filtered.sort((a, b) => {
            if (sortBy === 'payment-high') {
                return (parseFloat(b.values.payment) || 0) - (parseFloat(a.values.payment) || 0);
            }
            if (sortBy === 'payment-low') {
                return (parseFloat(a.values.payment) || 0) - (parseFloat(b.values.payment) || 0);
            }
            if (sortBy === 'proposals') {
                return (b.proposals?.length || 0) - (a.proposals?.length || 0);
            }
            if (sortBy === 'recent') {
                const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                return bTime - aTime;
            }
            return 0;
        });

        return filtered;
    }, [mockJobs, searchTerm, sortBy, selectedCategories, selectedExperience, selectedPriority, selectedLocations, paymentRange]);

    const toggleFilter = (filterArray: string[], setFilterArray: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        if (filterArray.includes(value)) {
            setFilterArray(filterArray.filter((item) => item !== value));
        } else {
            setFilterArray([...filterArray, value]);
        }
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedExperience([]);
        setSelectedPriority([]);
        setSelectedLocations([]);
        setPaymentRange([0, 100000]);
        setSearchTerm('');
    };

    const activeFiltersCount = selectedCategories.length + selectedExperience.length +
        selectedPriority.length + selectedLocations.length;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load jobs</p>
                <Button onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background ">
            {/* Header */}
            <div className="bg-background border sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Jobs</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {filteredAndSortedJobs.length} jobs available
                            </p>
                        </div>
                        <Button onClick={() => (onOpenCreateJob ? onOpenCreateJob() : router.push('/jobs/create'))}>
                            <RiAddLine className='h-5 w-5' />
                            Create Job
                        </Button>
                    </div>

                    {/* Search and Sort Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <RiSearchLine className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                            <Input
                                type="text"
                                placeholder="Search jobs, skills, or keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="payment-high">Highest Payment</SelectItem>
                                <SelectItem value="payment-low">Lowest Payment</SelectItem>
                                <SelectItem value="proposals">Most Proposals</SelectItem>
                            </SelectContent>
                        </Select>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="relative flex items-center">
                                    <RiFilterLine className="w-5 h-5" />
                                    <span className="font-medium">Filters</span>
                                    {activeFiltersCount > 0 && (
                                        <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {activeFiltersCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full max-w-md p-6  overflow-y-auto ">
                                <SheetHeader className="mb-6 !px-0">
                                    <SheetTitle className="text-2xl font-bold">Filter Jobs</SheetTitle>
                                    <SheetDescription>
                                        Refine your job search like a pro
                                    </SheetDescription>
                                </SheetHeader>

                                <div className="space-y-8">
                                    {/* Category Filter */}
                                    {categories.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <Label className="text-lg font-semibold">Category</Label>
                                                {selectedCategories.length > 0 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedCategories([])}
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                {categories.map(category => (
                                                    <div key={category} className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={category}
                                                            checked={selectedCategories.includes(category)}
                                                            onCheckedChange={() => toggleFilter(selectedCategories, setSelectedCategories, category)}
                                                            className="h-5 w-5"
                                                        />
                                                        <Label htmlFor={category} className="cursor-pointer">
                                                            {category}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience Filter */}
                                    {experiences.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <Label className="text-lg font-semibold">Experience Level</Label>
                                                {selectedExperience.length > 0 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedExperience([])}
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                {experiences.map(exp => (
                                                    <div key={exp} className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={exp}
                                                            checked={selectedExperience.includes(exp)}
                                                            onCheckedChange={() => toggleFilter(selectedExperience, setSelectedExperience, exp)}
                                                            className="h-5 w-5 "
                                                        />
                                                        <Label htmlFor={exp} className="cursor-pointer">
                                                            {exp}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <Label className="text-lg font-semibold">Priority</Label>
                                            {selectedPriority.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedPriority([])}
                                                >
                                                    Clear
                                                </Button>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {priorities.map(priority => (
                                                <div key={priority} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={priority}
                                                        checked={selectedPriority.includes(priority)}
                                                        onCheckedChange={() => toggleFilter(selectedPriority, setSelectedPriority, priority)}
                                                        className="h-5 w-5"
                                                    />
                                                    <Label htmlFor={priority} className="cursor-pointer capitalize">
                                                        {priority}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location Filter */}
                                    {locations.length > 0 && (
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <Label className="text-lg font-semibold">Location</Label>
                                                {selectedLocations.length > 0 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedLocations([])}
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                {locations.map(location => (
                                                    <div key={location} className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={location}
                                                            checked={selectedLocations.includes(location)}
                                                            onCheckedChange={() => toggleFilter(selectedLocations, setSelectedLocations, location)}
                                                            className="h-5 w-5"
                                                        />
                                                        <Label htmlFor={location} className="cursor-pointer">
                                                            {location}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Range */}
                                    <div>
                                        <Label className="text-lg font-semibold">
                                            Payment Range: KSh {paymentRange[0].toLocaleString()} - KSh {paymentRange[1].toLocaleString()}
                                        </Label>
                                        <Slider
                                            min={0}
                                            max={100000}
                                            step={5000}
                                            value={paymentRange}
                                            onValueChange={setPaymentRange}
                                            className="mt-4"
                                        />
                                    </div>

                                    {/* Clear All */}
                                    {activeFiltersCount > 0 && (
                                        <Button
                                            onClick={clearAllFilters}
                                            variant="outline"
                                            className="w-full py-3 border-2 border-gray-200 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg font-semibold"
                                        >
                                            Clear All Filters
                                        </Button>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                        {selectedCategories.map(cat => (
                            <Badge key={cat} variant="secondary" className="gap-1 p-1">
                                {cat}
                                <RiCloseLine
                                    onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                                    className='cursor-pointer ml-1 h-4 w-4' />
                            </Badge>
                        ))}
                        {selectedExperience.map(exp => (
                            <Badge key={exp} variant="secondary" className="gap-1 p-1">
                                {exp}
                                <RiCloseLine
                                    className="cursor-pointer ml-1 h-4 w-4"
                                    onClick={() => toggleFilter(selectedExperience, setSelectedExperience, exp)}
                                />
                            </Badge>
                        ))}
                        {selectedPriority.map(pri => (
                            <Badge key={pri} variant="secondary" className="gap-1 p-1 capitalize">
                                {pri}
                                <RiCloseLine
                                    className="cursor-pointer ml-1 h-4 w-4"
                                    onClick={() => toggleFilter(selectedPriority, setSelectedPriority, pri)}
                                />
                            </Badge>
                        ))}
                        {selectedLocations.map(loc => (
                            <Badge key={loc} variant="secondary" className="gap-1 p-1">
                                {loc}
                                <RiCloseLine
                                    className="cursor-pointer ml-1 h-4 w-4"
                                    onClick={() => toggleFilter(selectedLocations, setSelectedLocations, loc)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Job Grid */}
            <div className="container mx-auto py-8">
                {filteredAndSortedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAndSortedJobs.map(job => {
                            const numericId = Number(job.id ?? job._id);
                            return (
                            <JobCard
                                key={job._id}
                                {...job}
                                canViewProposals={true}
                                isOwner
                                onClick={() => router.push(`/jobs/${job._id}`)}
                                onEdit={
                                    Number.isFinite(numericId)
                                        ? () => setEditJobId(numericId)
                                        : undefined
                                }
                                onDelete={
                                    Number.isFinite(numericId)
                                        ? () => setDeleteJobId(numericId)
                                        : undefined
                                }
                            />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 items-center flex flex-col">
                        <RiSearchLine
                            className="text-6xl text-gray-400 mb-4 h-10 w-10"
                        />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No jobs found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                            Try adjusting your filters or search terms
                        </p>
                        <Button onClick={clearAllFilters} variant="outline">
                            Clear All Filters
                        </Button>
                    </div>
                )}
            </div>

            <EditJobModal
                jobId={editJobId}
                open={editJobId != null}
                onOpenChange={(open) => {
                    if (!open) setEditJobId(null);
                }}
            />

            <Dialog open={deleteJobId != null} onOpenChange={(open) => !open && setDeleteJobId(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete this job?</DialogTitle>
                        <DialogDescription>
                            This will remove the job from the board. You can post a new job anytime.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteJobId(null)}
                            disabled={deleteJobMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={deleteJobMutation.isPending}
                            onClick={() => {
                                if (deleteJobId != null) deleteJobMutation.mutate(deleteJobId);
                            }}
                        >
                            {deleteJobMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting…
                                </>
                            ) : (
                                'Delete job'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MyJobBoard;
