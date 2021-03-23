#include <linux/proc_fs.h>
#include <linux/seq_file.h>
#include <asm/uaccess.h>
#include <linux/hugetlb.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/fs.h>

#define BUFSIZE     150

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de memoria");
MODULE_AUTHOR("grupo_23");
struct sysinfo inf;

static int generar_json(struct seq_file * archivo, void *v) {
    
    //#define Convert(x) ((x) << (PAGE_SHIFT - 10))
    si_meminfo(&inf);
    long total_memoria = (inf.totalram *4);
    long memoria_libre = (inf.freeram *4);
    long buffer = (inf.bufferram); //((inf.bufferram) / 1024);
    long cached = (global_node_page_state(NR_FILE_PAGES) * 3) - inf.bufferram;
    long memoria_uso = total_memoria - (memoria_libre + buffer + cached);
    long porcentaje_utilizado = ((memoria_uso * 100) / total_memoria);

    

    seq_printf(archivo, "{\n");
    seq_printf(archivo, "\"Memoria_Total\":%lu ,\n", total_memoria/1024);///---
    seq_printf(archivo, "\"Memoria_Libre\":%lu ,\n", memoria_libre/1024);
    seq_printf(archivo, "\"Memoria_Uso\":%lu ,\n", (memoria_uso)/1024);///---
    seq_printf(archivo, "\"Compartida\":%lu ,\n", ((inf.sharedram)/1024));
    
    seq_printf(archivo, "\"Porcentaje\":%lu\n", (porcentaje_utilizado));//--->
    seq_printf(archivo, "}\n");
    

    return 0;
}

static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file,generar_json,NULL);
}

static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};


static int iniciar(void)
{
    proc_create("memory_info",0,NULL,&operaciones);
    printk(KERN_INFO "Grupo 23\n");
    return 0;
}

static void salir(void){
    remove_proc_entry("memory_info",NULL);
    printk(KERN_INFO "Curso: Sistemas Operativos 1 \n");
}

module_init(iniciar);
module_exit(salir);