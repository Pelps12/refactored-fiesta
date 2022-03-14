import mixpanel from "mixpanel-browser";

export class MixPanelTracking{
    private static _instance: MixPanelTracking;

    public static getInstance(): MixPanelTracking{
        if(MixPanelTracking._instance == null)
            return (MixPanelTracking._instance = new MixPanelTracking());
        return this._instance;
    }


    public constructor(){
        if(MixPanelTracking._instance){
            throw new Error("Error: Instance creation of MixpanelTracking is not allowed. Use Mixpanel.getInstance instead.");
        }

        mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {debug:true, ignore_dnt: true})
    }
    public track(name: string, data: object={}){
        mixpanel.track(name, data)
    }
    public identify(id: string){
        mixpanel.identify(id)
    }
    public set(data:any){
        
        const [first_name, last_name]: string[] = data.user.name.split(" ")
        console.log(first_name)
        mixpanel.people.set({
            $first_name: first_name,
            $last_name: last_name,
            $email: data.user.email
        })
    }

    public pageViewed(){
        this.track("page-viewed")
    }

    
    public loggedIn(data:any){
        this.identify(data.id)
        this.set(data)
        this.track("logged in")
        console.log("Done")
    }


}