
import React from 'react';
import { formatDistance, format, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Share
} from 'lucide-react';
import { EventWithAttendees } from '@/types/events';
import { useAuth } from '@/lib/auth';

interface EventDetailsProps {
  event: EventWithAttendees;
  onRSVP: (status: 'attending' | 'interested' | 'declined') => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onRSVP,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  
  const isEventPast = isPast(new Date(event.date));
  const canManage = user && (event.is_creator || user.isAdmin);
  
  // Format date and time
  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(new Date(event.date), 'h:mm a');
  
  // Get relative time (e.g., "2 days from now" or "3 days ago")
  const relativeTime = formatDistance(
    new Date(event.date),
    new Date(),
    { addSuffix: true }
  );
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <div className="flex items-center mt-2 space-x-2">
            {event.is_featured && (
              <Badge variant="default" className="mr-2">Featured</Badge>
            )}
            <Badge variant="outline">{event.category}</Badge>
            <span className="text-sm text-muted-foreground">{relativeTime}</span>
          </div>
        </div>

        {event.image_url && (
          <div className="w-24 h-24 rounded-md overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {event.description && (
          <p className="text-muted-foreground">{event.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formattedTime}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {event.attendees} {event.attendees === 1 ? 'person' : 'people'} attending
                {event.max_attendees && ` (max: ${event.max_attendees})`}
              </span>
            </div>
            
            {event.is_creator && (
              <div className="mt-3">
                <Badge variant="outline" className="bg-primary/10">You created this event</Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="space-x-2">
          {!isEventPast && (
            <>
              <Button 
                variant={event.user_status === 'attending' ? 'default' : 'outline'}
                onClick={() => onRSVP('attending')}
              >
                {event.user_status === 'attending' ? 'Attending' : 'Attend'}
              </Button>
              
              <Button 
                variant={event.user_status === 'interested' ? 'default' : 'outline'}
                onClick={() => onRSVP('interested')}
              >
                Interested
              </Button>
              
              <Button 
                variant={event.user_status === 'declined' ? 'destructive' : 'outline'}
                onClick={() => onRSVP('declined')}
              >
                Decline
              </Button>
            </>
          )}
        </div>
        
        {canManage && (
          <div className="space-x-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
